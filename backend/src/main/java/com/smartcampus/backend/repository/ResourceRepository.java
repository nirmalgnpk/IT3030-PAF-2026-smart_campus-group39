package com.smartcampus.backend.repository;

import com.smartcampus.backend.model.Resource;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ResourceRepository extends MongoRepository<Resource, String> {

    /**
     * Find resources by type
     * @param type the type of resource (LECTURE_HALL, LAB, MEETING_ROOM, EQUIPMENT)
     * @return list of resources matching the type
     */
    List<Resource> findByType(String type);

    /**
     * Find resources by location
     * @param location the location of the resource
     * @return list of resources at the specified location
     */
    List<Resource> findByLocation(String location);

    /**
     * Find resources by status
     * @param status the status of the resource (ACTIVE, OUT_OF_SERVICE)
     * @return list of resources with the specified status
     */
    List<Resource> findByStatus(String status);

    /**
     * Find resources with capacity greater than or equal to the specified value
     * @param capacity the minimum capacity required
     * @return list of resources meeting the capacity requirement
     */
    List<Resource> findByCapacityGreaterThanEqual(int capacity);

    /**
     * Find resources by type and location
     * @param type the type of resource
     * @param location the location of the resource
     * @return list of resources matching both type and location
     */
    List<Resource> findByTypeAndLocation(String type, String location);
}
