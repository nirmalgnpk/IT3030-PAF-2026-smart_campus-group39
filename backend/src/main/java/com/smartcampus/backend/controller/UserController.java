package com.smartcampus.backend.controller;

import com.smartcampus.backend.dto.UserDTO;
import com.smartcampus.backend.model.User;
import com.smartcampus.backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class UserController {

    @Autowired private UserService userService;

    @GetMapping
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
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