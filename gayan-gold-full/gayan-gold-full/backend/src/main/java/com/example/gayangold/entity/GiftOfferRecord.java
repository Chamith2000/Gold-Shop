package com.example.gayangold.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "gift_offer_records", indexes = @Index(name = "idx_gift_offer_type", columnList = "record_type"))
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class GiftOfferRecord {
    @Id
    @Column(length = 40)
    private String id;

    @Column(name = "record_type", nullable = false, length = 40)
    private String recordType;

    @Lob
    @Column(name = "payload", nullable = false, columnDefinition = "LONGTEXT")
    private String payload;

    @Column(nullable = false)
    private Boolean active = true;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist
    void prePersist() {
        LocalDateTime now = LocalDateTime.now();
        if (createdAt == null) createdAt = now;
        if (updatedAt == null) updatedAt = now;
    }

    @PreUpdate
    void preUpdate() { updatedAt = LocalDateTime.now(); }
}
