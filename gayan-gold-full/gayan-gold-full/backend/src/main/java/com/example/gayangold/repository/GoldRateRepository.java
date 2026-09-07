package com.example.gayangold.repository;

import com.example.gayangold.entity.GoldRate;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface GoldRateRepository extends JpaRepository<GoldRate, String> {
    Optional<GoldRate> findByDate(LocalDate date);
    List<GoldRate> findTop8ByOrderByDateDesc();
    Optional<GoldRate> findFirstByOrderByDateDesc();
}
