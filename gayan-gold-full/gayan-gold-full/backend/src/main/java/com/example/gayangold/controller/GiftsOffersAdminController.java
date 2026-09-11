package com.example.gayangold.controller;

import com.example.gayangold.service.GiftOfferAdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class GiftsOffersAdminController {
    private final GiftOfferAdminService service;

    @GetMapping("/gifts/categories") public ResponseEntity<?> categories() { return ResponseEntity.ok(service.list("CATEGORY")); }
    @PostMapping("/gifts/categories") public ResponseEntity<?> createCategory(@RequestBody Map<String,Object> b) { return ResponseEntity.ok(service.create("CATEGORY", b)); }
    @PutMapping("/gifts/categories/{id}") public ResponseEntity<?> updateCategory(@PathVariable String id,@RequestBody Map<String,Object> b) { return ResponseEntity.ok(service.update("CATEGORY",id,b)); }
    @DeleteMapping("/gifts/categories/{id}") public ResponseEntity<?> deleteCategory(@PathVariable String id) { service.delete("CATEGORY",id); return ResponseEntity.ok(Map.of("message","Gift category deleted")); }

    @GetMapping("/gifts/products") public ResponseEntity<?> products() { return ResponseEntity.ok(service.list("PRODUCT")); }
    @PostMapping("/gifts/products") public ResponseEntity<?> createProduct(@RequestBody Map<String,Object> b) { return ResponseEntity.ok(service.create("PRODUCT", b)); }
    @PutMapping("/gifts/products/{id}") public ResponseEntity<?> updateProduct(@PathVariable String id,@RequestBody Map<String,Object> b) { return ResponseEntity.ok(service.update("PRODUCT",id,b)); }
    @DeleteMapping("/gifts/products/{id}") public ResponseEntity<?> deleteProduct(@PathVariable String id) { service.delete("PRODUCT",id); return ResponseEntity.ok(Map.of("message","Gift product deleted")); }

    @GetMapping("/gifts/combos") public ResponseEntity<?> combos() { return ResponseEntity.ok(service.list("COMBO")); }
    @PostMapping("/gifts/combos") public ResponseEntity<?> createCombo(@RequestBody Map<String,Object> b) { return ResponseEntity.ok(service.create("COMBO", b)); }
    @PutMapping("/gifts/combos/{id}") public ResponseEntity<?> updateCombo(@PathVariable String id,@RequestBody Map<String,Object> b) { return ResponseEntity.ok(service.update("COMBO",id,b)); }
    @DeleteMapping("/gifts/combos/{id}") public ResponseEntity<?> deleteCombo(@PathVariable String id) { service.delete("COMBO",id); return ResponseEntity.ok(Map.of("message","Combo pack deleted")); }

    @GetMapping("/gifts/recommendations") public ResponseEntity<?> recommendations() { return ResponseEntity.ok(service.list("RECOMMENDATION")); }
    @PostMapping("/gifts/recommendations") public ResponseEntity<?> createRecommendation(@RequestBody Map<String,Object> b) { return ResponseEntity.ok(service.create("RECOMMENDATION", b)); }
    @PutMapping("/gifts/recommendations/{id}") public ResponseEntity<?> updateRecommendation(@PathVariable String id,@RequestBody Map<String,Object> b) { return ResponseEntity.ok(service.update("RECOMMENDATION",id,b)); }
    @DeleteMapping("/gifts/recommendations/{id}") public ResponseEntity<?> deleteRecommendation(@PathVariable String id) { service.delete("RECOMMENDATION",id); return ResponseEntity.ok(Map.of("message","Recommendation rule deleted")); }

    @GetMapping("/offers") public ResponseEntity<?> offers() { return ResponseEntity.ok(service.list("OFFER")); }
    @PostMapping("/offers") public ResponseEntity<?> createOffer(@RequestBody Map<String,Object> b) { return ResponseEntity.ok(service.create("OFFER", b)); }
    @PutMapping("/offers/{id}") public ResponseEntity<?> updateOffer(@PathVariable String id,@RequestBody Map<String,Object> b) { return ResponseEntity.ok(service.update("OFFER",id,b)); }
    @DeleteMapping("/offers/{id}") public ResponseEntity<?> deleteOffer(@PathVariable String id) { service.delete("OFFER",id); return ResponseEntity.ok(Map.of("message","Offer deleted")); }

    @GetMapping("/homepage/sections") public ResponseEntity<?> homepage() { return ResponseEntity.ok(service.list("HOMEPAGE")); }
    @PutMapping("/homepage/sections") public ResponseEntity<?> updateHomepage(@RequestBody Map<String,Object> body) {
        Object value = body.get("sections");
        if (!(value instanceof List<?> raw)) return ResponseEntity.badRequest().body(Map.of("message","sections must be an array"));
        List<Map<String,Object>> sections = new ArrayList<>();
        for (Object item : raw) if (item instanceof Map<?,?> map) {
            Map<String,Object> section = new LinkedHashMap<>();
            map.forEach((k,v) -> section.put(String.valueOf(k), v));
            sections.add(section);
        }
        return ResponseEntity.ok(service.replaceHomepage(sections));
    }
}
