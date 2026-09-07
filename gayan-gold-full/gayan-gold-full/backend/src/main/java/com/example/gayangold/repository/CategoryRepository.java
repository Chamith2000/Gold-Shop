package com.example.gayangold.repository;

import com.example.gayangold.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CategoryRepository extends JpaRepository<Category, String> {
    Optional<Category> findBySlug(String slug);
    List<Category> findByActiveTrueOrderByDisplayOrderAsc();
    boolean existsBySlug(String slug);
}
