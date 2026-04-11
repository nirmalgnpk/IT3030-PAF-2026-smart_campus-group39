package com.smartcampus.backend.controller;

import java.io.IOException;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.smartcampus.backend.dto.UserDTO;
import com.smartcampus.backend.model.User;
import com.smartcampus.backend.service.UserService;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class UserController {

    @Autowired
    private UserService userService;

    // ── CREATE USER (multipart: fields + optional photo) ──────────────────────
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<User> createUser(
            @RequestPart("user")  UserDTO userDTO,
            @RequestPart(value = "photo", required = false) MultipartFile photo)
            throws IOException {

        User user = new User(
                userDTO.getUserName(),
                userDTO.getName(),
                userDTO.getEmail(),
                userDTO.getPassword(),
                userDTO.getRole()
        );

        if (photo != null && !photo.isEmpty()) {
            user.setProfilePhoto(photo.getBytes());
            user.setProfilePhotoType(photo.getContentType());
        }

        User createdUser = userService.createUser(user);
        return new ResponseEntity<>(createdUser, HttpStatus.CREATED);
    }

    // ── GET ALL USERS ─────────────────────────────────────────────────────────
    @GetMapping
    public ResponseEntity<List<User>> getAllUsers() {
        return new ResponseEntity<>(userService.getAllUsers(), HttpStatus.OK);
    }

    // ── GET USER BY ID ────────────────────────────────────────────────────────
    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable String id) {
        User user = userService.getUserById(id);
        return user != null
                ? new ResponseEntity<>(user, HttpStatus.OK)
                : new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    // ── GET PROFILE PHOTO (returns raw image bytes) ───────────────────────────
    @GetMapping("/{id}/photo")
    public ResponseEntity<byte[]> getProfilePhoto(@PathVariable String id) {
        User user = userService.getUserById(id);

        if (user == null || user.getProfilePhoto() == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        String mimeType = user.getProfilePhotoType() != null
                ? user.getProfilePhotoType()
                : "application/octet-stream";

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.parseMediaType(mimeType));

        return new ResponseEntity<>(user.getProfilePhoto(), headers, HttpStatus.OK);
    }

    // ── UPDATE USER (multipart: fields + optional new photo) ──────────────────
    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<User> updateUser(
            @PathVariable String id,
            @RequestPart("user") UserDTO userDTO,
            @RequestPart(value = "photo", required = false) MultipartFile photo)
            throws IOException {

        User existingUser = userService.getUserById(id);
        if (existingUser == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        existingUser.setUserName(userDTO.getUserName());
        existingUser.setName(userDTO.getName());
        existingUser.setEmail(userDTO.getEmail());
        existingUser.setPassword(userDTO.getPassword());
        existingUser.setRole(userDTO.getRole());

        if (photo != null && !photo.isEmpty()) {
            existingUser.setProfilePhoto(photo.getBytes());
            existingUser.setProfilePhotoType(photo.getContentType());
        }

        User updatedUser = userService.updateUser(id, existingUser);
        return new ResponseEntity<>(updatedUser, HttpStatus.OK);
    }

    // ── DELETE USER ───────────────────────────────────────────────────────────
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteUser(@PathVariable String id) {
        User user = userService.getUserById(id);
        if (user != null) {
            userService.deleteUser(id);
            return new ResponseEntity<>("User deleted successfully", HttpStatus.OK);
        }
        return new ResponseEntity<>("User not found", HttpStatus.NOT_FOUND);
    }
}