package com.example.gayangold.repository;

import com.example.gayangold.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface ProductRepository extends JpaRepository<Product, String>, JpaSpecificationExecutor<Product> {
    Optional<Product> findBySlug(String slug);
    List<Product> findByCategoryId(String categoryId);
    List<Product> findByIsFeaturedTrue();
    List<Product> findByIsNewArrivalTrue();
    List<Product> findByIsBestSellerTrue();

    @Query("SELECT COUNT(p) FROM Product p WHERE p.stockCount = 0 OR p.inStock = false")
    long countOutOfStock();

    @Query("SELECT COUNT(p) FROM Product p WHERE p.stockCount > 0 AND p.stockCount <= 5")
    long countLowStock();
}
