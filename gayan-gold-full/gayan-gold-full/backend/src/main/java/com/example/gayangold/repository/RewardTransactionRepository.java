package com.example.gayangold.repository;

import com.example.gayangold.entity.RewardTransaction;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RewardTransactionRepository extends JpaRepository<RewardTransaction, String> {
    List<RewardTransaction> findByUserIdOrderByCreatedAtDesc(String userId);
}
