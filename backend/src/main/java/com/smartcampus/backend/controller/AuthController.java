package com.smartcampus.backend.controller;

import com.smartcampus.backend.model.User;
import com.smartcampus.backend.repository.UserRepository;
import com.smartcampus.backend.service.JwtService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Value("${file.upload-dir}")
    private String uploadDir;

    // POST /api/auth/register
    @PostMapping("/register")
    public ResponseEntity<Map<String, Object>> register(@RequestBody Map<String, String> body) {
        String name     = body.get("name");
        String email    = body.get("email");
        String password = body.get("password");

        if (name == null || name.isBlank())
            return badRequest("Name is required");
        if (email == null || email.isBlank())
            return badRequest("Email is required");
        if (password == null || password.length() < 6)
            return badRequest("Password must be at least 6 characters");

        if (userRepository.existsByEmail(email.toLowerCase().trim())) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("message", "This email address is already registered"));
        }

        String role = body.getOrDefault("role", "USER");
        if (!role.matches("USER|ADMIN|TECHNICIAN|MANAGER|STUDENT")) role = "USER";

        User user = new User();
        user.setName(name.trim());
        user.setEmail(email.toLowerCase().trim());
        user.setUserName(body.getOrDefault("userName", email.split("@")[0]).trim());
        user.setPassword(passwordEncoder.encode(password));
        user.setRole(role);
        user.setProvider("LOCAL");
        user.setEnabled(true);
        user.setCreatedAt(LocalDateTime.now());
        user.setUpdatedAt(LocalDateTime.now());

        User saved = userRepository.save(user);
        String token = jwtService.generateToken(saved.getEmail(), saved.getRole(), saved.getId());

        Map<String, Object> response = new HashMap<>();
        response.put("token",           token);
        response.put("userId",          saved.getId());
        response.put("role",            saved.getRole());
        response.put("name",            saved.getName());
        response.put("email",           saved.getEmail());
        response.put("userName",        saved.getUserName());
        response.put("profilePhotoUrl", saved.getProfilePhotoUrl() != null ? saved.getProfilePhotoUrl() : "");
        response.put("provider",        saved.getProvider());
        response.put("message",         "Registration successful");
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    // POST /api/auth/login
    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody Map<String, String> body) {
        String email    = body.get("email");
        String password = body.get("password");

        if (email == null || password == null)
            return badRequest("Email and password are required");

        Optional<User> optional = userRepository.findByEmail(email.toLowerCase().trim());
        if (optional.isEmpty())
            return unauthorized("Invalid email or password");

        User user = optional.get();

        if (user.getPassword() == null || user.getPassword().isBlank())
            return unauthorized("This account was created with " + user.getProvider() + ". Please use social login.");

        if (!passwordEncoder.matches(password, user.getPassword()))
            return unauthorized("Invalid email or password");

        if (!user.isEnabled())
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("message", "Your account has been disabled."));

        String token = jwtService.generateToken(user.getEmail(), user.getRole(), user.getId());

        Map<String, Object> response = new HashMap<>();
        response.put("token",           token);
        response.put("userId",          user.getId());
        response.put("role",            user.getRole());
        response.put("name",            user.getName());
        response.put("email",           user.getEmail());
        response.put("userName",        user.getUserName());
        response.put("profilePhotoUrl", user.getProfilePhotoUrl() != null ? user.getProfilePhotoUrl() : "");
        response.put("provider",        user.getProvider());
        response.put("message",         "Login successful");
        return ResponseEntity.ok(response);
    }

    // GET /api/auth/verify
    @GetMapping("/verify")
    public ResponseEntity<Map<String, Object>> verifyToken(
            @RequestHeader(value = "Authorization", required = false) String authHeader) {

        if (authHeader == null || !authHeader.startsWith("Bearer "))
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("valid", false, "message", "No token provided"));

        String token = authHeader.substring(7);
        if (!jwtService.isTokenValid(token))
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("valid", false, "message", "Token is invalid or has expired"));

        String userId = jwtService.extractUserId(token);
        Optional<User> userOpt = userRepository.findById(userId);

        Map<String, Object> resp = new HashMap<>();
        resp.put("valid",  true);
        resp.put("email",  jwtService.extractEmail(token));
        resp.put("role",   jwtService.extractRole(token));
        resp.put("userId", userId);
        userOpt.ifPresent(u -> {
            resp.put("name",            u.getName());
            resp.put("userName",        u.getUserName());
            resp.put("profilePhotoUrl", u.getProfilePhotoUrl() != null ? u.getProfilePhotoUrl() : "");
        });
        return ResponseEntity.ok(resp);
    }

    // POST /api/auth/logout  (stateless — just a success response)
    @PostMapping("/logout")
    public ResponseEntity<Map<String, Object>> logout() {
        return ResponseEntity.ok(Map.of("message", "Logged out successfully"));
    }

    // POST /api/auth/upload-photo/{userId}
    // NOTE: FileUploadController.java must be DELETED — this is the only upload endpoint.
    @PostMapping("/upload-photo/{userId}")
    public ResponseEntity<Map<String, Object>> uploadPhoto(
            @PathVariable String userId,
            @RequestParam("file") MultipartFile file,
            HttpServletRequest request) {

        if (file.isEmpty()) return badRequest("Please select a file to upload");

        String contentType = file.getContentType();
        if (contentType == null || !contentType.startsWith("image/"))
            return badRequest("Only image files are allowed");

        if (file.getSize() > 5 * 1024 * 1024)
            return badRequest("File size must not exceed 5 MB");

        try {
            Path uploadPath = Paths.get(uploadDir).toAbsolutePath().normalize();
            Files.createDirectories(uploadPath);

            String original  = file.getOriginalFilename();
            String extension = (original != null && original.contains("."))
                    ? original.substring(original.lastIndexOf(".")).toLowerCase() : ".jpg";
            String filename  = userId + "_" + System.currentTimeMillis() + extension;

            Files.write(uploadPath.resolve(filename), file.getBytes());

            Optional<User> optional = userRepository.findById(userId);
            if (optional.isEmpty())
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("message", "User not found"));

            // Build full absolute URL so the frontend can display it directly
            String baseUrl = request.getScheme() + "://"
                    + request.getServerName() + ":"
                    + request.getServerPort();
            String photoUrl = baseUrl + "/uploads/profile-photos/" + filename;

            User user = optional.get();
            user.setProfilePhotoUrl(photoUrl);
            user.setUpdatedAt(LocalDateTime.now());
            userRepository.save(user);

            return ResponseEntity.ok(Map.of("message", "Profile photo updated", "photoUrl", photoUrl));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Upload failed: " + e.getMessage()));
        }
    }

    // POST /api/auth/forgot-password
    @PostMapping("/forgot-password")
    public ResponseEntity<Map<String, Object>> forgotPassword(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        if (email == null || email.isBlank())
            return badRequest("Email is required");
        // TODO: send reset email via JavaMailSender
        return ResponseEntity.ok(Map.of("message", "If that email exists, a reset link has been sent."));
    }

    // POST /api/auth/reset-password  (stub)
    @PostMapping("/reset-password")
    public ResponseEntity<Map<String, Object>> resetPassword(@RequestBody Map<String, String> body) {
        return ResponseEntity.ok(Map.of("message", "Password reset not yet implemented"));
    }

    // POST /api/auth/refresh-token  (stub)
    @PostMapping("/refresh-token")
    public ResponseEntity<Map<String, Object>> refreshToken(@RequestBody Map<String, String> body) {
        return ResponseEntity.ok(Map.of("message", "Refresh token not yet implemented"));
    }

    private ResponseEntity<Map<String, Object>> badRequest(String message) {
        return ResponseEntity.badRequest().body(Map.of("message", message));
    }

    private ResponseEntity<Map<String, Object>> unauthorized(String message) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", message));
    }
}