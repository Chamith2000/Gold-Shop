package com.example.gayangold.repository;

import com.example.gayangold.entity.LuckySpinRecord;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface LuckySpinRecordRepository extends JpaRepository<LuckySpinRecord, String> {
    Optional<LuckySpinRecord> findTopByUserIdOrderBySpunAtDesc(String userId);
    List<LuckySpinRecord> findByUserIdOrderBySpunAtDesc(String userId);
}
