package com.smartcampus.backend.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import com.smartcampus.backend.model.User;

public interface UserRepository extends MongoRepository<User, String> {

    User findByEmail(String email);
}