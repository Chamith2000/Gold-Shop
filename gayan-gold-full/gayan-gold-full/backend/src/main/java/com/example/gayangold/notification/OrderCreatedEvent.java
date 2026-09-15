package com.example.gayangold.notification;

import com.example.gayangold.entity.OrderEntity;

/**
 * Published after an order has been persisted so external notifications do not
 * participate in the database transaction.
 */
public record OrderCreatedEvent(OrderEntity order) {
}
