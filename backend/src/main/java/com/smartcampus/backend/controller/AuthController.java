package com.smartcampus.backend.controller;

import com.smartcampus.backend.model.User;
import com.smartcampus.backend.repository.UserRepository;
import com.smartcampus.backend.service.EmailService;
import com.smartcampus.backend.service.JwtService;
import com.smartcampus.backend.service.OtpService;
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
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001", "http://localhost:3005", "http://localhost:5173"})
public class AuthController {

    @Autowired private UserRepository  userRepository;
    @Autowired private JwtService      jwtService;
    @Autowired private PasswordEncoder passwordEncoder;
    @Autowired private OtpService      otpService;
    @Autowired(required = false) private EmailService    emailService;

    @Value("${file.upload-dir}")
    private String uploadDir;

    // Pending registrations: email → form data (password already encoded)
    private final Map<String, Map<String, String>> pendingRegistrations = new ConcurrentHashMap<>();

    // Short-lived reset tokens: email → UUID  (consumed after /forgot-password/reset)
    private final Map<String, String> resetTokens = new ConcurrentHashMap<>();

    // =========================================================================
    //  REGISTRATION — Step 1: validate, store pending, send OTP
    // =========================================================================

    @PostMapping("/send-register-otp")
    public ResponseEntity<Map<String, Object>> sendRegisterOtp(@RequestBody Map<String, String> body) {

        String name     = body.get("name");
        String userName = body.get("userName");
        String email    = body.get("email");
        String password = body.get("password");
        String role     = body.getOrDefault("role", "USER");

        if (name == null || name.isBlank())
            return badRequest("Name is required");
        if (email == null || email.isBlank())
            return badRequest("Email is required");
        if (password == null || password.length() < 6)
            return badRequest("Password must be at least 6 characters");

        String normalizedEmail = email.toLowerCase().trim();

        if (userRepository.existsByEmail(normalizedEmail))
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("message", "An account with this email already exists."));

        String resolvedUserName = (userName != null && !userName.isBlank())
                ? userName.trim() : normalizedEmail.split("@")[0];

        if (userRepository.existsByUserName(resolvedUserName))
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("message", "Username is already taken."));

        if (!role.matches("USER|ADMIN|TECHNICIAN|MANAGER|STUDENT")) role = "USER";

        Map<String, String> pending = new HashMap<>();
        pending.put("name",     name.trim());
        pending.put("userName", resolvedUserName);
        pending.put("email",    normalizedEmail);
        pending.put("password", passwordEncoder.encode(password));
        pending.put("role",     role);
        pendingRegistrations.put(normalizedEmail, pending);

        String otp = otpService.generateAndStore(normalizedEmail);
        try {
            if (emailService != null) {
                emailService.sendOtp(normalizedEmail, otp, "REGISTER");
            } else {
                System.out.println("[AUTH] Email service not configured. OTP for registration: " + otp);
            }
        } catch (Exception e) {
            pendingRegistrations.remove(normalizedEmail);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Failed to send OTP email. Please try again."));
        }

        return ResponseEntity.ok(Map.of("message", "OTP sent to " + normalizedEmail));
    }

    // =========================================================================
    //  REGISTRATION — Step 2: verify OTP, save user, return JWT
    // =========================================================================

    @PostMapping("/verify-register-otp")
    public ResponseEntity<Map<String, Object>> verifyRegisterOtp(@RequestBody Map<String, String> body) {

        String email = body.get("email");
        String otp   = body.get("otp");

        if (email == null || otp == null)
            return badRequest("Email and OTP are required");

        String normalizedEmail = email.toLowerCase().trim();

        if (!otpService.verify(normalizedEmail, otp.trim()))
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Invalid or expired OTP. Please try again."));

        Map<String, String> pending = pendingRegistrations.get(normalizedEmail);
        if (pending == null) {
            otpService.remove(normalizedEmail);
            return ResponseEntity.status(HttpStatus.GONE)
                    .body(Map.of("message", "Registration session expired. Please start again."));
        }

        if (userRepository.existsByEmail(normalizedEmail)) {
            pendingRegistrations.remove(normalizedEmail);
            otpService.remove(normalizedEmail);
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("message", "An account with this email already exists."));
        }

        User user = new User();
        user.setName(pending.get("name"));
        user.setUserName(pending.get("userName"));
        user.setEmail(normalizedEmail);
        user.setPassword(pending.get("password"));
        user.setRole(pending.get("role"));
        user.setProvider("LOCAL");
        user.setEnabled(true);
        user.setCreatedAt(LocalDateTime.now());
        user.setUpdatedAt(LocalDateTime.now());

        User saved = userRepository.save(user);

        otpService.remove(normalizedEmail);
        pendingRegistrations.remove(normalizedEmail);

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

    // =========================================================================
    //  LOGIN
    // =========================================================================

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

    // =========================================================================
    //  TOKEN VERIFY / LOGOUT / REFRESH
    // =========================================================================

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

        String         userId  = jwtService.extractUserId(token);
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

    @PostMapping("/logout")
    public ResponseEntity<Map<String, Object>> logout() {
        return ResponseEntity.ok(Map.of("message", "Logged out successfully"));
    }

    @PostMapping("/refresh-token")
    public ResponseEntity<Map<String, Object>> refreshToken(@RequestBody Map<String, String> body) {
        return ResponseEntity.ok(Map.of("message", "Refresh token not yet implemented"));
    }

    // =========================================================================
    //  PROFILE PHOTO UPLOAD
    // =========================================================================

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

            String baseUrl  = request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort();
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

    // =========================================================================
    //  FORGOT PASSWORD — Step 1: send OTP
    // =========================================================================

    @PostMapping("/forgot-password/send-otp")
    public ResponseEntity<Map<String, Object>> forgotPasswordSendOtp(@RequestBody Map<String, String> body) {

        String email = body.get("email");
        if (email == null || email.isBlank())
            return badRequest("Email is required");

        String normalizedEmail = email.toLowerCase().trim();

        if (!userRepository.existsByEmail(normalizedEmail))
            return ResponseEntity.ok(Map.of("message", "If that email exists, an OTP has been sent."));

        String otp = otpService.generateAndStore(normalizedEmail);
        try {
            if (emailService != null) {
                emailService.sendOtp(normalizedEmail, otp, "RESET_PASSWORD");
            } else {
                System.out.println("[AUTH] Email service not configured. OTP for password reset: " + otp);
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Failed to send OTP. Please try again."));
        }

        return ResponseEntity.ok(Map.of("message", "OTP sent to " + normalizedEmail));
    }

    // =========================================================================
    //  FORGOT PASSWORD — Step 2: verify OTP, issue reset token
    // =========================================================================

    @PostMapping("/forgot-password/verify-otp")
    public ResponseEntity<Map<String, Object>> forgotPasswordVerifyOtp(@RequestBody Map<String, String> body) {

        String email = body.get("email");
        String otp   = body.get("otp");

        if (email == null || otp == null)
            return badRequest("Email and OTP are required");

        String normalizedEmail = email.toLowerCase().trim();

        if (!otpService.verify(normalizedEmail, otp.trim()))
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Invalid or expired OTP. Please try again."));

        String token = UUID.randomUUID().toString();
        resetTokens.put(normalizedEmail, token);
        otpService.remove(normalizedEmail);

        Map<String, Object> resp = new HashMap<>();
        resp.put("resetToken", token);
        resp.put("email",      normalizedEmail);
        resp.put("message",    "OTP verified. You may now reset your password.");
        return ResponseEntity.ok(resp);
    }

    // =========================================================================
    //  FORGOT PASSWORD — Step 3: set new password
    // =========================================================================

    @PostMapping("/forgot-password/reset")
    public ResponseEntity<Map<String, Object>> forgotPasswordReset(@RequestBody Map<String, String> body) {

        String email       = body.get("email");
        String resetToken  = body.get("resetToken");
        String newPassword = body.get("newPassword");

        if (email == null || resetToken == null || newPassword == null)
            return badRequest("Email, reset token, and new password are required");

        String normalizedEmail = email.toLowerCase().trim();
        String storedToken     = resetTokens.get(normalizedEmail);

        if (storedToken == null || !storedToken.equals(resetToken))
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Invalid or expired reset session. Please start again."));

        if (newPassword.length() < 6)
            return badRequest("Password must be at least 6 characters");

        Optional<User> optional = userRepository.findByEmail(normalizedEmail);
        if (optional.isEmpty()) {
            resetTokens.remove(normalizedEmail);
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", "Account not found"));
        }

        User user = optional.get();
        user.setPassword(passwordEncoder.encode(newPassword));
        user.setUpdatedAt(LocalDateTime.now());
        userRepository.save(user);

        resetTokens.remove(normalizedEmail);

        return ResponseEntity.ok(Map.of("message", "Password updated successfully. You may now sign in."));
    }

    // =========================================================================
    //  Legacy stubs — kept for backward compatibility
    // =========================================================================

    @Deprecated
    @PostMapping("/forgot-password")
    public ResponseEntity<Map<String, Object>> forgotPasswordLegacy(@RequestBody Map<String, String> body) {
        return forgotPasswordSendOtp(body);
    }

    @Deprecated
    @PostMapping("/reset-password")
    public ResponseEntity<Map<String, Object>> resetPasswordLegacy(@RequestBody Map<String, String> body) {
        return badRequest("Please use /api/auth/forgot-password/reset with a valid OTP reset token.");
    }

    // =========================================================================
    //  Helpers
    // =========================================================================

    private ResponseEntity<Map<String, Object>> badRequest(String message) {
        return ResponseEntity.badRequest().body(Map.of("message", message));
    }

    private ResponseEntity<Map<String, Object>> unauthorized(String message) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", message));
    }
}