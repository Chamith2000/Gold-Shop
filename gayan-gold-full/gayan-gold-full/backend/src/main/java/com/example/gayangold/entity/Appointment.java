package com.example.gayangold.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;
import java.time.LocalDate;

@Entity
@Table(name = "appointments", indexes = {
        @Index(name = "idx_appointment_user", columnList = "user_id"),
        @Index(name = "idx_appointment_date", columnList = "appointment_date")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Appointment {

    @Id
    @Column(length = 64)
    private String id;

    @Column(nullable = false, unique = true, length = 40)
    private String appointmentNumber;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false, length = 150)
    private String customerName;

    @Column(nullable = false, length = 180)
    private String customerEmail;

    @Column(length = 30)
    private String customerPhone;

    @Column(name = "appointment_date", nullable = false)
    private LocalDate date;

    @Column(nullable = false, length = 20)
    private String timeSlot;

    @Column(nullable = false, length = 80)
    private String appointmentType;

    @Column(nullable = false)
    @Builder.Default
    private Integer visitorCount = 1;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    @Builder.Default
    private Status status = Status.PENDING;

    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    private TrafficLevel storeTrafficLevel;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private Instant createdAt;

    public enum Status {
        PENDING, CONFIRMED, COMPLETED, CANCELLED, REJECTED
    }

    public enum TrafficLevel {
        LOW, MODERATE, HIGH
    }
}
