package com.example.gayangold.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.Instant;

@Entity
@Table(name = "reward_profiles", indexes = {
        @Index(name = "idx_reward_user", columnList = "user_id", unique = true)
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RewardProfile {

    @Id
    @Column(length = 64)
    private String id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Column(nullable = false)
    @Builder.Default
    private Integer currentPoints = 0;

    @Column(nullable = false)
    @Builder.Default
    private Integer lifetimeEarned = 0;

    @Column(nullable = false)
    @Builder.Default
    private Integer lifetimeRedeemed = 0;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    @Builder.Default
    private Tier rewardTier = Tier.SILVER;

    @Column(nullable = false)
    @Builder.Default
    private Double pointsMultiplier = 1.0;

    @UpdateTimestamp
    private Instant updatedAt;

    public enum Tier {
        SILVER, GOLD, PLATINUM
    }
}
