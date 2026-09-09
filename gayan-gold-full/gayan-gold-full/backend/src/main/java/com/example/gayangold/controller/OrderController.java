package com.example.gayangold.controller;

import com.example.gayangold.entity.User;
import com.example.gayangold.exception.ApiException;
import com.example.gayangold.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    @PostMapping
    public ResponseEntity<Map<String, Object>> create(
            @RequestBody Map<String, Object> body,
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(orderService.createOrder(body, user));
    }

    @GetMapping("/my-orders")
    public ResponseEntity<List<Map<String, Object>>> getMyOrders(@AuthenticationPrincipal User user) {
        if (user == null) {
            throw ApiException.unauthorized("Please sign in to view your orders.");
        }
        return ResponseEntity.ok(orderService.getMyOrders(user.getId()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> getById(@PathVariable String id, @AuthenticationPrincipal User user) {
        if (user == null) {
            throw ApiException.unauthorized("Please sign in to view this order.");
        }
        boolean isAdmin = user.getRole() != null && user.getRole().name().equals("ADMIN");
        return ResponseEntity.ok(orderService.getById(id, user.getId(), isAdmin));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<Map<String, Object>> updateStatus(
            @PathVariable String id,
            @RequestBody Map<String, String> body,
            @AuthenticationPrincipal User user) {
        if (user == null || user.getRole() == null || !user.getRole().name().equals("ADMIN")) {
            throw ApiException.forbidden("Only admins can update order status.");
        }
        return ResponseEntity.ok(orderService.updateStatus(id, body.get("orderStatus"), body.get("paymentStatus")));
    }
}