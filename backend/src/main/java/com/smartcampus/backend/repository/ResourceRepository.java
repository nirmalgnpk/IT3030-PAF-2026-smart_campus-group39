package com.smartcampus.backend.repository;

import com.smartcampus.backend.model.Resource;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ResourceRepository extends MongoRepository<Resource, String> {
    List<Resource> findByType(String type);
    List<Resource> findByLocation(String location);
    List<Resource> findByStatus(String status);
    List<Resource> findByCapacityGreaterThanEqual(int capacity);
    List<Resource> findByTypeAndLocation(String type, String location);
}