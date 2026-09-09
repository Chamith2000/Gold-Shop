package com.example.gayangold.controller;

import com.example.gayangold.entity.User;
import com.example.gayangold.exception.ApiException;
import com.example.gayangold.service.WishlistService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/wishlist")
@RequiredArgsConstructor
public class WishlistController {

    private final WishlistService wishlistService;

    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> getAll(@AuthenticationPrincipal User user) {
        if (user == null) {
            throw ApiException.unauthorized("Please sign in to view your wishlist.");
        }
        return ResponseEntity.ok(wishlistService.getAll(user.getId()));
    }

    @PostMapping("/toggle")
    public ResponseEntity<Map<String, Object>> toggle(
            @RequestBody Map<String, String> body,
            @AuthenticationPrincipal User user) {
        if (user == null) {
            throw ApiException.unauthorized("Please sign in to use your wishlist.");
        }
        return ResponseEntity.ok(wishlistService.toggle(user.getId(), user, body.get("productId")));
    }
}