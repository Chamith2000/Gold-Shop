package com.example.gayangold.service;

import com.example.gayangold.entity.OrderEntity;
import com.example.gayangold.entity.OrderItem;
import com.example.gayangold.entity.Product;
import com.example.gayangold.entity.RewardProfile;
import com.example.gayangold.entity.User;
import com.example.gayangold.exception.ApiException;
import com.example.gayangold.notification.OrderCreatedEvent;
import com.example.gayangold.repository.OrderRepository;
import com.example.gayangold.repository.ProductRepository;
import com.example.gayangold.repository.RewardProfileRepository;
import com.example.gayangold.util.IdGenerator;
import lombok.RequiredArgsConstructor;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final RewardProfileRepository rewardProfileRepository;
    private final AuthService authService;
    private final ApplicationEventPublisher eventPublisher;

    @SuppressWarnings("unchecked")
    @Transactional
    public Map<String, Object> createOrder(Map<String, Object> body, User user) {
        if (user == null) {
            throw ApiException.unauthorized("Please sign in to place an order.");
        }

        List<Map<String, Object>> itemsInput = (List<Map<String, Object>>) body.get("items");
        if (itemsInput == null || itemsInput.isEmpty()) {
            throw ApiException.badRequest("Your cart is empty.");
        }

        List<OrderItem> orderItems = new ArrayList<>();
        BigDecimal subtotal = BigDecimal.ZERO;

        for (Map<String, Object> itemInput : itemsInput) {
            String productId = (String) itemInput.get("productId");
            int quantity = itemInput.get("quantity") != null
                    ? Integer.parseInt(itemInput.get("quantity").toString()) : 1;

            Product product = productRepository.findById(productId)
                    .orElseThrow(() -> ApiException.notFound("Product not found: " + productId));

            if (product.getStockCount() != null && product.getStockCount() < quantity) {
                throw ApiException.conflict("Not enough stock for " + product.getName());
            }

            BigDecimal lineTotal = product.getPrice().multiply(BigDecimal.valueOf(quantity));
            subtotal = subtotal.add(lineTotal);

            orderItems.add(OrderItem.builder()
                    .productId(product.getId())
                    .productName(product.getName())
                    .price(product.getPrice())
                    .quantity(quantity)
                    .goldPurity(product.getGoldPurity() != null ? product.getGoldPurity().toFrontend() : null)
                    .image(product.getImages() != null && !product.getImages().isEmpty()
                            ? product.getImages().get(0) : null)
                    .build());

            if (product.getStockCount() != null) {
                product.setStockCount(product.getStockCount() - quantity);
                if (product.getStockCount() <= 0) {
                    product.setStockCount(0);
                    product.setInStock(false);
                }
                productRepository.save(product);
            }
        }

        RewardProfile profile = rewardProfileRepository.findByUserId(user.getId())
                .orElseThrow(() -> ApiException.notFound("Reward profile not found for user."));

        int requestedPoints = body.get("pointsToRedeem") != null
                ? Integer.parseInt(body.get("pointsToRedeem").toString()) : 0;
        int maxRedeemable = Math.min(
                profile.getCurrentPoints(),
                subtotal.multiply(BigDecimal.valueOf(0.3)).setScale(0, RoundingMode.FLOOR).intValue());
        int pointsRedeemed = Math.max(0, Math.min(requestedPoints, maxRedeemable));

        BigDecimal discountAmount = BigDecimal.valueOf(pointsRedeemed);
        BigDecimal shippingFee = BigDecimal.ZERO;
        BigDecimal totalAmount = subtotal.subtract(discountAmount).add(shippingFee);
        if (totalAmount.compareTo(BigDecimal.ZERO) < 0) {
            totalAmount = BigDecimal.ZERO;
        }

        double tierMultiplier = switch (profile.getRewardTier()) {
            case PLATINUM -> 1.5;
            case GOLD -> 1.25;
            default -> 1.0;
        };
        int earnedPoints = totalAmount.divide(BigDecimal.valueOf(100), 4, RoundingMode.FLOOR)
                .multiply(BigDecimal.valueOf(tierMultiplier))
                .setScale(0, RoundingMode.FLOOR)
                .intValue();

        Map<String, Object> shippingAddress = (Map<String, Object>) body.getOrDefault("shippingAddress", Map.of());

        OrderEntity order = OrderEntity.builder()
                .id(IdGenerator.uuid("ord"))
                .orderNumber(IdGenerator.orderNumber())
                .user(user)
                .customerName((String) shippingAddress.getOrDefault("fullName", user.getFullName()))
                .customerEmail(user.getEmail())
                .items(new ArrayList<>())
                .subtotal(subtotal)
                .discountAmount(discountAmount)
                .pointsRedeemed(pointsRedeemed)
                .shippingFee(shippingFee)
                .totalAmount(totalAmount)
                .paymentStatus(OrderEntity.PaymentStatus.PENDING)
                .orderStatus(OrderEntity.OrderStatus.PENDING)
                .earnedPoints(earnedPoints)
                .shippingStreet((String) shippingAddress.get("street"))
                .shippingCity((String) shippingAddress.get("city"))
                .shippingState((String) shippingAddress.get("state"))
                .shippingPostalCode((String) shippingAddress.get("postalCode"))
                .shippingCountry((String) shippingAddress.getOrDefault("country", "Sri Lanka"))
                .build();

        for (OrderItem item : orderItems) {
            item.setOrder(order);
            order.getItems().add(item);
        }

        OrderEntity saved = orderRepository.save(order);

        profile.setCurrentPoints(profile.getCurrentPoints() - pointsRedeemed + earnedPoints);
        profile.setLifetimeEarned(profile.getLifetimeEarned() + earnedPoints);
        profile.setLifetimeRedeemed(profile.getLifetimeRedeemed() + pointsRedeemed);
        RewardProfile savedProfile = rewardProfileRepository.save(profile);

        // External notifications are handled only after this transaction commits.
        eventPublisher.publishEvent(new OrderCreatedEvent(saved.getId()));

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("message", "Order placed successfully");
        result.put("order", toMap(saved));
        result.put("earnedPoints", earnedPoints);
        result.put("updatedRewardProfile", authService.toProfileMap(savedProfile));
        return result;
    }

    @Transactional(readOnly = true)
    public List<Map<String, Object>> getMyOrders(String userId) {
        return orderRepository.findByUserIdOrderByCreatedAtDesc(userId)
                .stream().map(this::toMap).toList();
    }

    @Transactional(readOnly = true)
    public Map<String, Object> getById(String id, String userId, boolean isAdmin) {
        OrderEntity order = orderRepository.findById(id)
                .orElseThrow(() -> ApiException.notFound("Order not found: " + id));
        if (!isAdmin && (order.getUser() == null || !order.getUser().getId().equals(userId))) {
            throw ApiException.forbidden("You do not have access to this order.");
        }
        return toMap(order);
    }

    @Transactional(readOnly = true)
    public List<Map<String, Object>> getAllForAdmin() {
        return orderRepository.findAllByOrderByCreatedAtDesc()
                .stream().map(this::toMap).toList();
    }

    @Transactional
    public Map<String, Object> updateStatus(String id, String orderStatus, String paymentStatus) {
        OrderEntity order = orderRepository.findById(id)
                .orElseThrow(() -> ApiException.notFound("Order not found: " + id));
        if (orderStatus != null && !orderStatus.isBlank()) {
            order.setOrderStatus(OrderEntity.OrderStatus.valueOf(orderStatus));
        }
        if (paymentStatus != null && !paymentStatus.isBlank()) {
            order.setPaymentStatus(OrderEntity.PaymentStatus.valueOf(paymentStatus));
        }
        return toMap(orderRepository.save(order));
    }

    private Map<String, Object> toMap(OrderEntity o) {
        Map<String, Object> m = new LinkedHashMap<>();
        m.put("id", o.getId());
        m.put("orderNumber", o.getOrderNumber());
        m.put("userId", o.getUser() != null ? o.getUser().getId() : null);
        m.put("customerName", o.getCustomerName());
        m.put("customerEmail", o.getCustomerEmail());

        List<Map<String, Object>> items = new ArrayList<>();
        for (OrderItem item : o.getItems()) {
            Map<String, Object> im = new LinkedHashMap<>();
            im.put("productId", item.getProductId());
            im.put("productName", item.getProductName());
            im.put("price", item.getPrice());
            im.put("quantity", item.getQuantity());
            im.put("goldPurity", item.getGoldPurity());
            im.put("image", item.getImage());
            items.add(im);
        }
        m.put("items", items);

        m.put("subtotal", o.getSubtotal());
        m.put("discountAmount", o.getDiscountAmount());
        m.put("pointsRedeemed", o.getPointsRedeemed());
        m.put("shippingFee", o.getShippingFee());
        m.put("totalAmount", o.getTotalAmount());
        m.put("paymentStatus", o.getPaymentStatus().name());
        m.put("orderStatus", o.getOrderStatus().name());
        m.put("earnedPoints", o.getEarnedPoints());

        Map<String, Object> shipping = new LinkedHashMap<>();
        shipping.put("street", o.getShippingStreet());
        shipping.put("city", o.getShippingCity());
        shipping.put("state", o.getShippingState());
        shipping.put("postalCode", o.getShippingPostalCode());
        shipping.put("country", o.getShippingCountry());
        m.put("shippingAddress", shipping);

        m.put("createdAt", o.getCreatedAt() != null ? o.getCreatedAt().toString() : null);
        m.put("updatedAt", o.getUpdatedAt() != null ? o.getUpdatedAt().toString() : null);
        return m;
    }
}
