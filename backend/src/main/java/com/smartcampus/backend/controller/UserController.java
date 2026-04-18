package com.smartcampus.backend.controller;

import com.smartcampus.backend.dto.UserDTO;
import com.smartcampus.backend.model.User;
import com.smartcampus.backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class UserController {

    @Autowired private UserService userService;

    @GetMapping
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getUserStats() {
        List<User> users = userService.getAllUsers();

        long total       = users.size();
        long students    = users.stream().filter(u -> "STUDENT".equals(u.getRole()) || "USER".equals(u.getRole())).count();
        long technicians = users.stream().filter(u -> "TECHNICIAN".equals(u.getRole())).count();
        long managers    = users.stream().filter(u -> "MANAGER".equals(u.getRole())).count();
        long admins      = users.stream().filter(u -> "ADMIN".equals(u.getRole())).count();
        long active      = users.stream().filter(User::isEnabled).count();
        long disabled    = total - active;
        long localUsers  = users.stream().filter(u -> "LOCAL".equals(u.getProvider()) || u.getProvider() == null).count();
        long googleUsers = users.stream().filter(u -> "GOOGLE".equals(u.getProvider())).count();

        DateTimeFormatter fmt = DateTimeFormatter.ofPattern("MMM yyyy");
        Map<String, Long> byMonth = users.stream()
                .filter(u -> u.getCreatedAt() != null)
                .collect(Collectors.groupingBy(
                        u -> u.getCreatedAt().format(fmt),
                        LinkedHashMap::new,
                        Collectors.counting()
                ));

        Map<String, Object> stats = new LinkedHashMap<>();
        stats.put("total",                 total);
        stats.put("students",              students);
        stats.put("technicians",           technicians);
        stats.put("managers",              managers);
        stats.put("admins",                admins);
        stats.put("active",                active);
        stats.put("disabled",              disabled);
        stats.put("localUsers",            localUsers);
        stats.put("googleUsers",           googleUsers);
        stats.put("registrationsByMonth",  byMonth);

        return ResponseEntity.ok(stats);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getUserById(@PathVariable String id) {
        User user = userService.getUserById(id);
        if (user == null)
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", "User not found"));
        return ResponseEntity.ok(user);
    }

    @PostMapping
    public ResponseEntity<User> createUser(@RequestBody UserDTO userDTO) {
        User user = new User(
                userDTO.getUserName(), userDTO.getName(),
                userDTO.getEmail(), userDTO.getPassword(),
                userDTO.getRole()
        );
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(userService.createUser(user));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateUser(
            @PathVariable String id,
            @RequestBody Map<String, Object> body) {

        User existing = userService.getUserById(id);
        if (existing == null)
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", "User not found"));

        if (body.containsKey("name"))
            existing.setName((String) body.get("name"));
        if (body.containsKey("userName"))
            existing.setUserName((String) body.get("userName"));
        if (body.containsKey("email"))
            existing.setEmail((String) body.get("email"));
        if (body.containsKey("role"))
            existing.setRole((String) body.get("role"));
        if (body.containsKey("profilePhotoUrl"))
            existing.setProfilePhotoUrl((String) body.get("profilePhotoUrl"));
        if (body.containsKey("enabled"))
            existing.setEnabled((Boolean) body.get("enabled"));

        existing.setUpdatedAt(LocalDateTime.now());
        return ResponseEntity.ok(userService.updateUser(id, existing));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable String id) {
        if (userService.getUserById(id) == null)
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", "User not found"));
        userService.deleteUser(id);
        return ResponseEntity.ok(Map.of("message", "User deleted successfully"));
    }

    @PostMapping("/change-password")
    public ResponseEntity<?> changePassword(
            @RequestBody Map<String, String> body) {

        String userId          = body.get("userId");
        String currentPassword = body.get("currentPassword");
        String newPassword     = body.get("newPassword");

        if (userId == null || currentPassword == null || newPassword == null)
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "All fields are required"));

        try {
            userService.changePassword(userId, currentPassword, newPassword);
            return ResponseEntity.ok(
                    Map.of("message", "Password changed successfully"));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", e.getMessage()));
        }
    }
}