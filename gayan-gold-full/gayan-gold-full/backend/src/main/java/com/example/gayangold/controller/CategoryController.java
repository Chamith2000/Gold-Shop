package com.example.gayangold.controller;

import com.example.gayangold.entity.Category;
import com.example.gayangold.exception.ApiException;
import com.example.gayangold.repository.CategoryRepository;
import com.example.gayangold.util.IdGenerator;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/categories")
@RequiredArgsConstructor
public class CategoryController {

    private final CategoryRepository categoryRepository;

    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> getAll() {
        return ResponseEntity.ok(
                categoryRepository.findByActiveTrueOrderByDisplayOrderAsc().stream()
                        .map(this::toMap)
                        .collect(Collectors.toList())
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> getById(@PathVariable String id) {
        Category c = categoryRepository.findById(id)
                .or(() -> categoryRepository.findBySlug(id))
                .orElseThrow(() -> ApiException.notFound("Category not found"));
        return ResponseEntity.ok(toMap(c));
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> create(@RequestBody Map<String, Object> body) {
        Category c = Category.builder()
                .id(IdGenerator.uuid("cat"))
                .name((String) body.get("name"))
                .slug(body.get("slug") != null ? (String) body.get("slug") : ((String) body.get("name")).toLowerCase().replaceAll("[^a-z0-9]+", "-"))
                .description((String) body.get("description"))
                .imageUrl((String) body.get("imageUrl"))
                .displayOrder(body.get("displayOrder") != null ? ((Number) body.get("displayOrder")).intValue() : 0)
                .active(body.get("active") == null || Boolean.TRUE.equals(body.get("active")))
                .build();
        categoryRepository.save(c);
        return ResponseEntity.ok(toMap(c));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Map<String, Object>> update(@PathVariable String id, @RequestBody Map<String, Object> body) {
        Category c = categoryRepository.findById(id).orElseThrow(() -> ApiException.notFound("Category not found"));
        if (body.containsKey("name")) c.setName((String) body.get("name"));
        if (body.containsKey("description")) c.setDescription((String) body.get("description"));
        if (body.containsKey("imageUrl")) c.setImageUrl((String) body.get("imageUrl"));
        if (body.containsKey("displayOrder")) c.setDisplayOrder(((Number) body.get("displayOrder")).intValue());
        if (body.containsKey("active")) c.setActive(Boolean.TRUE.equals(body.get("active")));
        categoryRepository.save(c);
        return ResponseEntity.ok(toMap(c));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> delete(@PathVariable String id) {
        if (!categoryRepository.existsById(id)) throw ApiException.notFound("Category not found");
        categoryRepository.deleteById(id);
        return ResponseEntity.ok(Map.of("message", "Category deleted successfully"));
    }

    private Map<String, Object> toMap(Category c) {
        Map<String, Object> m = new LinkedHashMap<>();
        m.put("id", c.getId());
        m.put("name", c.getName());
        m.put("slug", c.getSlug());
        m.put("description", c.getDescription());
        m.put("imageUrl", c.getImageUrl());
        m.put("displayOrder", c.getDisplayOrder());
        m.put("active", c.getActive());
        return m;
    }
}
