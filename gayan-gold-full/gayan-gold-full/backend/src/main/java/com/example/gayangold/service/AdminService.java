package com.example.gayangold.service;

import com.example.gayangold.entity.OrderEntity;
import com.example.gayangold.entity.User;
import com.example.gayangold.exception.ApiException;
import com.example.gayangold.repository.OrderRepository;
import com.example.gayangold.repository.ProductRepository;
import com.example.gayangold.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final UserRepository userRepository;
    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;

    @Transactional(readOnly = true)
    public Map<String, Object> getDashboard() {
        Map<String, Object> result = new LinkedHashMap<>();
        BigDecimal totalRevenue = orderRepository.sumTotalRevenue();

        result.put("totalRevenue", totalRevenue);
        result.put("totalOrders", orderRepository.count());
        result.put("pendingOrders", orderRepository.countByOrderStatus(OrderEntity.OrderStatus.PENDING));
        result.put("processingOrders", orderRepository.countByOrderStatus(OrderEntity.OrderStatus.PROCESSING));
        result.put("deliveredOrders", orderRepository.countByOrderStatus(OrderEntity.OrderStatus.DELIVERED));
        result.put("totalProducts", productRepository.count());
        result.put("totalCustomers", userRepository.countByRole(User.Role.CUSTOMER));
        return result;
    }

    @Transactional(readOnly = true)
    public List<Map<String, Object>> getUsers() {
        return userRepository.findAll().stream().map(this::toMap).toList();
    }

    @Transactional
    public Map<String, Object> updateUserStatus(String userId, String status, String role) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> ApiException.notFound("User not found: " + userId));

        if (status != null && !status.isBlank()) {
            user.setStatus(User.Status.valueOf(status));
        }
        if (role != null && !role.isBlank()) {
            user.setRole(User.Role.valueOf(role));
        }

        return toMap(userRepository.save(user));
    }

    private Map<String, Object> toMap(User u) {
        Map<String, Object> m = new LinkedHashMap<>();
        m.put("id", u.getId());
        m.put("fullName", u.getFullName());
        m.put("email", u.getEmail());
        m.put("phone", u.getPhone());
        m.put("role", u.getRole().name());
        m.put("status", u.getStatus().name());
        m.put("createdAt", u.getCreatedAt() != null ? u.getCreatedAt().toString() : null);
        return m;
    }
}