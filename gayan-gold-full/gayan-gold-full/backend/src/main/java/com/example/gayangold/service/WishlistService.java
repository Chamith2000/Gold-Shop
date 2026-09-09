package com.example.gayangold.service;

import com.example.gayangold.entity.Product;
import com.example.gayangold.entity.User;
import com.example.gayangold.entity.WishlistItem;
import com.example.gayangold.exception.ApiException;
import com.example.gayangold.repository.ProductRepository;
import com.example.gayangold.repository.WishlistRepository;
import com.example.gayangold.util.IdGenerator;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class WishlistService {

    private final WishlistRepository wishlistRepository;
    private final ProductRepository productRepository;
    private final ProductService productService;

    @Transactional(readOnly = true)
    public List<Map<String, Object>> getAll(String userId) {
        return wishlistRepository.findByUserId(userId).stream()
                .map(item -> productService.toMap(item.getProduct()))
                .toList();
    }

    @Transactional
    public Map<String, Object> toggle(String userId, User user, String productId) {
        boolean exists = wishlistRepository.existsByUserIdAndProductId(userId, productId);

        Map<String, Object> result = new LinkedHashMap<>();
        if (exists) {
            wishlistRepository.deleteByUserIdAndProductId(userId, productId);
            result.put("inWishlist", false);
        } else {
            Product product = productRepository.findById(productId)
                    .orElseThrow(() -> ApiException.notFound("Product not found: " + productId));

            WishlistItem item = WishlistItem.builder()
                    .id(IdGenerator.uuid("wish"))
                    .user(user)
                    .product(product)
                    .build();
            wishlistRepository.save(item);
            result.put("inWishlist", true);
        }
        result.put("productId", productId);
        return result;
    }
}