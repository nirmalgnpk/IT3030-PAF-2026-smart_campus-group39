package com.smartcampus.backend.repository;

import com.smartcampus.backend.model.Booking;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookingRepository extends MongoRepository<Booking, String> {

    List<Booking> findByUserId(String userId);

    List<Booking> findByResourceId(String resourceId);

    List<Booking> findByStatus(String status);

    List<Booking> findByResourceIdAndDateAndStatusNot(String resourceId, String date, String status);

    List<Booking> findByUserIdAndStatus(String userId, String status);

    List<Booking> findByDateBetween(String startDate, String endDate);
}
