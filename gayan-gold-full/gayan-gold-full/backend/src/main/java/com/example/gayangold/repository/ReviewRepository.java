package com.example.gayangold.repository;

import com.example.gayangold.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, String> {
    List<Review> findByProductIdAndIsApprovedTrue(String productId);
    List<Review> findByProductId(String productId);
}
