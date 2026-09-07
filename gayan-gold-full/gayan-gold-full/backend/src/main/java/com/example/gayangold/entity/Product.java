package com.example.gayangold.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "products", indexes = {
        @Index(name = "idx_product_slug", columnList = "slug", unique = true),
        @Index(name = "idx_product_category", columnList = "category_id"),
        @Index(name = "idx_product_purity", columnList = "gold_purity")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Product {

    @Id
    @Column(length = 64)
    private String id;

    @Column(nullable = false, length = 200)
    private String name;

    @Column(nullable = false, unique = true, length = 220)
    private String slug;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;

    @Column(nullable = false, precision = 14, scale = 2)
    private BigDecimal price;

    @Column(precision = 14, scale = 2)
    private BigDecimal originalPrice;

    @Enumerated(EnumType.STRING)
    @Column(name = "gold_purity", nullable = false, length = 10)
    private GoldPurity goldPurity;

    @Column(nullable = false, precision = 10, scale = 3)
    private BigDecimal weightGrams;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(columnDefinition = "JSON")
    private String specifications; // stored as JSON string

    @Column(nullable = false)
    @Builder.Default
    private Boolean inStock = true;

    @Column(nullable = false)
    @Builder.Default
    private Integer stockCount = 0;

    @ElementCollection
    @CollectionTable(name = "product_images", joinColumns = @JoinColumn(name = "product_id"))
    @Column(name = "image_url", columnDefinition = "LONGTEXT")
    @OrderColumn(name = "image_order")
    @Builder.Default
    private List<String> images = new ArrayList<>();

    @Column(nullable = false)
    @Builder.Default
    private Boolean isFeatured = false;

    @Column(nullable = false)
    @Builder.Default
    private Boolean isNewArrival = false;

    @Column(nullable = false)
    @Builder.Default
    private Boolean isBestSeller = false;

    @Column(precision = 3, scale = 2)
    private BigDecimal rating;

    @Column
    @Builder.Default
    private Integer reviewCount = 0;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private Instant createdAt;

    @UpdateTimestamp
    private Instant updatedAt;

    public enum GoldPurity {
        K24, K22, K18;

        public static GoldPurity fromFrontend(String value) {
            if (value == null) return K22;
            return switch (value.toUpperCase()) {
                case "24K", "K24", "24" -> K24;
                case "18K", "K18", "18" -> K18;
                default -> K22;
            };
        }

        public String toFrontend() {
            return switch (this) {
                case K24 -> "24K";
                case K22 -> "22K";
                case K18 -> "18K";
            };
        }
    }
}
