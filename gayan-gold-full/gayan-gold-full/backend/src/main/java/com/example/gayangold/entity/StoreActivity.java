package com.example.gayangold.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.Instant;

@Entity
@Table(name = "store_activity")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StoreActivity {

    @Id
    @Column(length = 64)
    private String id;

    @Column(nullable = false)
    @Builder.Default
    private Integer currentVisitorCount = 0;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    @Builder.Default
    private TrafficLevel trafficLevel = TrafficLevel.LOW;

    @Column(nullable = false)
    @Builder.Default
    private Integer estimatedWaitMinutes = 0;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    @Builder.Default
    private StoreStatus storeStatus = StoreStatus.OPEN;

    @Column(length = 500)
    private String peakHoursNote;

    private Instant recordedAt;

    @UpdateTimestamp
    private Instant updatedAt;

    @Column(length = 100)
    private String updatedBy;

    public enum TrafficLevel {
        LOW, MODERATE, HIGH
    }

    public enum StoreStatus {
        OPEN, BUSY, CLOSING_SOON, CLOSED
    }
}
