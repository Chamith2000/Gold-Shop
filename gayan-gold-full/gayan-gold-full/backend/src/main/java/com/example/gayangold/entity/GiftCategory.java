package com.example.gayangold.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "gift_categories")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class GiftCategory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 120)
    private String name;

    @Column(length = 500)
    private String description;

    @Column(nullable = false)
    private Boolean active = true;
}
