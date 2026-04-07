package com.smartcampus.backend.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.smartcampus.backend.model.User;
import com.smartcampus.backend.repository.UserRepository;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    // CREATE
    public User createUser(User user) {
        return userRepository.save(user);
    }

    // GET ALL
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    // GET BY ID
    public User getUserById(String id) {
        return userRepository.findById(id).orElse(null);
    }

    // UPDATE
    public User updateUser(String id, User user) {
        user.setId(id);
        return userRepository.save(user);
    }

    // DELETE
    public void deleteUser(String id) {
        userRepository.deleteById(id);
    }
}