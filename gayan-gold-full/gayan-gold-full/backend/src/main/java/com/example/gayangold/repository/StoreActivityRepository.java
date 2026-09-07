package com.example.gayangold.repository;

import com.example.gayangold.entity.StoreActivity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface StoreActivityRepository extends JpaRepository<StoreActivity, String> {
    Optional<StoreActivity> findFirstByOrderByUpdatedAtDesc();
}
