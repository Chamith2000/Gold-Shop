package com.example.gayangold.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;

@Entity
@Table(name = "gold_rates", indexes = {
        @Index(name = "idx_gold_rate_date", columnList = "rate_date", unique = true)
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GoldRate {

    @Id
    @Column(length = 64)
    private String id;

    @Column(name = "rate_date", nullable = false, unique = true)
    private LocalDate date;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal rate24k;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal rate22k;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal rate18k;

    @Column(nullable = false, precision = 14, scale = 2)
    private BigDecimal sovereign24k;

    @Column(nullable = false, precision = 14, scale = 2)
    private BigDecimal sovereign22k;

    @Column(nullable = false, length = 10)
    @Builder.Default
    private String currency = "LKR";

    @CreationTimestamp
    private Instant recordedAt;
}
