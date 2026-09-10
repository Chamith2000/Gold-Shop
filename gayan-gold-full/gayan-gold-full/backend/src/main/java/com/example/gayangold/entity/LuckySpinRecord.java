package com.example.gayangold.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;

@Entity
@Table(name = "lucky_spin_records", indexes = {
        @Index(name = "idx_spin_user_spun", columnList = "user_id,spun_at")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LuckySpinRecord {

    @Id
    @Column(length = 64)
    private String id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "segment_id", nullable = false, length = 64)
    private String segmentId;

    @Column(name = "segment_name", nullable = false, length = 100)
    private String segmentName;

    @Column(name = "reward_points", nullable = false)
    private Integer rewardPoints;

    @CreationTimestamp
    @Column(name = "spun_at", nullable = false, updatable = false)
    private Instant spunAt;

    @Column(name = "next_eligible_at", nullable = false)
    private Instant nextEligibleAt;
}
