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

    public User createUser(User user)              { return userRepository.save(user); }
    public List<User> getAllUsers()                { return userRepository.findAll(); }
    public User getUserById(String id)             { return userRepository.findById(id).orElse(null); }
    public User updateUser(String id, User user)   { user.setId(id); return userRepository.save(user); }
    public void deleteUser(String id)              { userRepository.deleteById(id); }
}