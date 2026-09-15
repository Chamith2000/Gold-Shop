package com.example.gayangold.notification;

import com.example.gayangold.entity.OrderEntity;
import com.example.gayangold.repository.OrderRepository;
import com.example.gayangold.service.WhatsAppNotificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;

@Component
@RequiredArgsConstructor
@Slf4j
public class OrderCreatedNotificationListener {

    private final OrderRepository orderRepository;
    private final WhatsAppNotificationService whatsAppNotificationService;

    @Async
    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    @Transactional(readOnly = true)
    public void handle(OrderCreatedEvent event) {
        try {
            OrderEntity order = orderRepository.findWithItemsById(event.orderId()).orElse(null);
            if (order == null) {
                log.error("Cannot send WhatsApp notification: order {} no longer exists", event.orderId());
                return;
            }
            whatsAppNotificationService.sendOrderCreatedNotification(order);
        } catch (Exception ex) {
            // Notification failure must never affect an already committed order.
            log.error("Unexpected WhatsApp notification error for order {}", event.orderId(), ex);
        }
    }
}
