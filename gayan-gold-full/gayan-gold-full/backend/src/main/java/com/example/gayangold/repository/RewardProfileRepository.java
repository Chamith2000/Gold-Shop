package com.example.gayangold.repository;

import com.example.gayangold.entity.RewardProfile;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RewardProfileRepository extends JpaRepository<RewardProfile, String> {
    Optional<RewardProfile> findByUserId(String userId);
}
