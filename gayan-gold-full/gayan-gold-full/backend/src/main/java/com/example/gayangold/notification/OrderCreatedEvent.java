package com.example.gayangold.notification;

/**
 * Lightweight domain event published after an order is created.
 * The listener reloads the order after commit, avoiding lazy-loading and
 * transaction-bound entity problems in asynchronous notification handling.
 */
public record OrderCreatedEvent(String orderId) {
}
