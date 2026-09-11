package com.example.gayangold.controller;

import com.example.gayangold.entity.GiftOfferRecord;
import com.example.gayangold.repository.GiftOfferRecordRepository;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class GiftsOffersController {
    private final GiftOfferRecordRepository repository;
    private final ObjectMapper objectMapper;

    @GetMapping("/gifts/categories")
    public ResponseEntity<List<Map<String, Object>>> categories() {
        return ResponseEntity.ok(list("CATEGORY", true));
    }

    @GetMapping("/gifts/products")
    public ResponseEntity<List<Map<String, Object>>> products(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String occasion,
            @RequestParam(required = false) Boolean featured,
            @RequestParam(required = false) Boolean popular,
            @RequestParam(required = false) Boolean newArrival,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Double minPrice,
            @RequestParam(required = false) Double maxPrice) {
        List<Map<String, Object>> result = list("PRODUCT", true).stream()
                .filter(p -> category == null || category.isBlank() || matches(p, "giftCategoryId", category) || matches(p, "giftCategoryName", category))
                .filter(p -> occasion == null || occasion.isBlank() || matchesIgnoreCase(p, "occasion", occasion))
                .filter(p -> featured == null || featured.equals(Boolean.TRUE) && Boolean.TRUE.equals(p.get("isFeatured")) || featured.equals(Boolean.FALSE))
                .filter(p -> popular == null || popular.equals(Boolean.TRUE) && Boolean.TRUE.equals(p.get("isPopular")) || popular.equals(Boolean.FALSE))
                .filter(p -> newArrival == null || newArrival.equals(Boolean.TRUE) && Boolean.TRUE.equals(p.get("isNewArrival")) || newArrival.equals(Boolean.FALSE))
                .filter(p -> search == null || search.isBlank() || contains(p, search))
                .filter(p -> minPrice == null || number(p.get("price")) >= minPrice)
                .filter(p -> maxPrice == null || number(p.get("price")) <= maxPrice)
                .collect(Collectors.toList());
        return ResponseEntity.ok(result);
    }

    @GetMapping("/gifts/products/{id}")
    public ResponseEntity<?> product(@PathVariable String id) {
        return find("PRODUCT", id).map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/gifts/combos")
    public ResponseEntity<List<Map<String, Object>>> combos() {
        return ResponseEntity.ok(list("COMBO", true));
    }

    @GetMapping("/gifts/combos/{id}")
    public ResponseEntity<?> combo(@PathVariable String id) {
        return find("COMBO", id).map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/gifts/recommendations/{productId}")
    public ResponseEntity<Map<String, Object>> recommendations(@PathVariable String productId) {
        List<Map<String, Object>> rules = list("RECOMMENDATION", true);
        Map<String, Object> rule = rules.stream()
                .filter(r -> productId.equals(String.valueOf(r.get("targetId"))))
                .findFirst()
                .orElse(null);

        List<String> giftIds = new ArrayList<>();
        if (rule != null && rule.get("recommendedGiftIds") instanceof List<?> ids) {
            for (Object id : ids) giftIds.add(String.valueOf(id));
        }

        List<Map<String, Object>> gifts = list("PRODUCT", true).stream()
                .filter(p -> giftIds.contains(String.valueOf(p.get("id"))))
                .toList();

        Map<String, Object> response = new LinkedHashMap<>();
        response.put("jewelleryProduct", null);
        response.put("recommendedGifts", gifts);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/offers")
    public ResponseEntity<List<Map<String, Object>>> offers(@RequestParam(required = false) String type) {
        List<Map<String, Object>> result = list("OFFER", true);
        if (type != null && !type.isBlank()) {
            result = result.stream().filter(o -> type.equalsIgnoreCase(String.valueOf(o.get("offerType")))).toList();
        }
        return ResponseEntity.ok(result);
    }

    @GetMapping("/offers/active")
    public ResponseEntity<List<Map<String, Object>>> activeOffers() {
        return ResponseEntity.ok(list("OFFER", true).stream().filter(this::isCurrentlyActive).toList());
    }

    @GetMapping("/offers/today")
    public ResponseEntity<List<Map<String, Object>>> todayOffers() {
        return ResponseEntity.ok(list("OFFER", true).stream().filter(this::isCurrentlyActive).toList());
    }

    @GetMapping("/offers/{id}")
    public ResponseEntity<?> offer(@PathVariable String id) {
        return find("OFFER", id).map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/homepage/sections")
    public ResponseEntity<List<Map<String, Object>>> homepageSections() {
        return ResponseEntity.ok(list("HOMEPAGE", true));
    }

    @GetMapping("/homepage/offers")
    public ResponseEntity<List<Map<String, Object>>> homepageOffers() {
        return ResponseEntity.ok(list("OFFER", true).stream().filter(this::isCurrentlyActive).toList());
    }

    @GetMapping("/homepage/gifts")
    public ResponseEntity<List<Map<String, Object>>> homepageGifts() {
        return ResponseEntity.ok(list("PRODUCT", true).stream().filter(p -> Boolean.TRUE.equals(p.get("isFeatured"))).toList());
    }

    private List<Map<String, Object>> list(String type, boolean activeOnly) {
        return repository.findAllByRecordTypeOrderByUpdatedAtDesc(type).stream()
                .filter(r -> !activeOnly || Boolean.TRUE.equals(r.getActive()))
                .map(this::toMap)
                .toList();
    }

    private Optional<Map<String, Object>> find(String type, String id) {
        return repository.findById(id)
                .filter(r -> type.equals(r.getRecordType()) && Boolean.TRUE.equals(r.getActive()))
                .map(this::toMap);
    }

    private Map<String, Object> toMap(GiftOfferRecord record) {
        try {
            Map<String, Object> map = objectMapper.readValue(record.getPayload(), new TypeReference<>() {});
            map.put("id", record.getId());
            map.put("active", record.getActive());
            map.put("createdAt", record.getCreatedAt());
            map.put("updatedAt", record.getUpdatedAt());
            return map;
        } catch (Exception e) {
            throw new IllegalStateException("Invalid stored Gift & Offers data", e);
        }
    }

    private boolean matches(Map<String, Object> map, String key, String value) {
        return value.equals(String.valueOf(map.get(key)));
    }

    private boolean matchesIgnoreCase(Map<String, Object> map, String key, String value) {
        return value.equalsIgnoreCase(String.valueOf(map.get(key)));
    }

    private boolean contains(Map<String, Object> map, String search) {
        String q = search.toLowerCase(Locale.ROOT);
        return String.valueOf(map.getOrDefault("name", "")).toLowerCase(Locale.ROOT).contains(q)
                || String.valueOf(map.getOrDefault("description", "")).toLowerCase(Locale.ROOT).contains(q)
                || String.valueOf(map.getOrDefault("occasion", "")).toLowerCase(Locale.ROOT).contains(q);
    }

    private double number(Object value) {
        if (value instanceof Number n) return n.doubleValue();
        try { return Double.parseDouble(String.valueOf(value)); }
        catch (Exception e) { return 0d; }
    }

    private boolean isCurrentlyActive(Map<String, Object> offer) {
        try {
            java.time.LocalDateTime now = java.time.LocalDateTime.now();
            java.time.LocalDateTime start = java.time.LocalDateTime.parse(String.valueOf(offer.get("startDate")).replace("Z", ""));
            if (now.isBefore(start)) return false;
            Object endValue = offer.get("endDate");
            return endValue == null || "null".equals(String.valueOf(endValue)) || now.isBefore(java.time.LocalDateTime.parse(String.valueOf(endValue).replace("Z", "")));
        } catch (Exception e) {
            return true;
        }
    }
}
