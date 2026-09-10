package com.example.gayangold.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;

@Entity
@Table(name = "reward_transactions", indexes = {
        @Index(name = "idx_reward_tx_user_created", columnList = "user_id,created_at")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RewardTransaction {

    @Id
    @Column(length = 64)
    private String id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private Type type;

    @Column(nullable = false)
    private Integer points;

    @Column(length = 100)
    private String reference;

    @Column(nullable = false, length = 500)
    private String description;

    @Column(name = "balance_after", nullable = false)
    private Integer balanceAfter;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private Instant createdAt;

    public enum Type {
        PURCHASE, REDEMPTION, LUCKY_WHEEL, ADMIN_ADJUSTMENT, REFUND_REVERSAL
    }
}
