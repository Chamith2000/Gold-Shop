package com.example.gayangold.service;

import com.example.gayangold.entity.Category;
import com.example.gayangold.entity.Product;
import com.example.gayangold.entity.Review;
import com.example.gayangold.exception.ApiException;
import com.example.gayangold.repository.CategoryRepository;
import com.example.gayangold.repository.ProductRepository;
import com.example.gayangold.repository.ReviewRepository;
import com.example.gayangold.util.IdGenerator;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.Predicate;
import lombok.RequiredArgsConstructor;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final ReviewRepository reviewRepository;

    @Transactional(readOnly = true)
    public List<Map<String, Object>> findAll(Map<String, String> params) {
        Specification<Product> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (params.get("category") != null) {
                String cat = params.get("category");
                Join<Product, Category> categoryJoin = root.join("category");
                predicates.add(cb.or(
                        cb.equal(categoryJoin.get("id"), cat),
                        cb.equal(categoryJoin.get("slug"), cat)
                ));
            }

            if (params.get("purity") != null) {
                Product.GoldPurity purity = Product.GoldPurity.fromFrontend(params.get("purity"));
                predicates.add(cb.equal(root.get("goldPurity"), purity));
            }

            if (params.get("search") != null) {
                String q = "%" + params.get("search").toLowerCase() + "%";
                predicates.add(cb.or(
                        cb.like(cb.lower(root.get("name")), q),
                        cb.like(cb.lower(root.get("description")), q)
                ));
            }

            if ("true".equals(params.get("featured"))) {
                predicates.add(cb.isTrue(root.get("isFeatured")));
            }

            if ("true".equals(params.get("newArrivals"))) {
                predicates.add(cb.isTrue(root.get("isNewArrival")));
            }

            if ("true".equals(params.get("bestSellers"))) {
                predicates.add(cb.isTrue(root.get("isBestSeller")));
            }

            if (params.get("minPrice") != null) {
                predicates.add(cb.ge(root.get("price"), new BigDecimal(params.get("minPrice"))));
            }

            if (params.get("maxPrice") != null) {
                predicates.add(cb.le(root.get("price"), new BigDecimal(params.get("maxPrice"))));
            }

            if (predicates.isEmpty()) {
                return cb.conjunction();
            }
            return cb.and(predicates.toArray(new Predicate[0]));
        };

        List<Product> products = new ArrayList<>(productRepository.findAll(spec));

        String sort = params.getOrDefault("sort", "");
        if ("price-low".equals(sort) || "price-asc".equals(sort)) {
            products.sort(Comparator.comparing(Product::getPrice));
        } else if ("price-high".equals(sort) || "price-desc".equals(sort)) {
            products.sort(Comparator.comparing(Product::getPrice).reversed());
        } else if ("rating".equals(sort)) {
            products.sort(Comparator.comparing((Product p) -> p.getRating() != null ? p.getRating() : BigDecimal.ZERO).reversed());
        } else if ("weight-desc".equals(sort)) {
            products.sort(Comparator.comparing(Product::getWeightGrams).reversed());
        } else if ("newest".equals(sort)) {
            products.sort(Comparator.comparing(Product::getCreatedAt, Comparator.nullsLast(Comparator.reverseOrder())));
        } else {
            // "featured" or unspecified: featured items first, then newest
            products.sort(Comparator
                    .comparing((Product p) -> Boolean.TRUE.equals(p.getIsFeatured()) ? 0 : 1)
                    .thenComparing(Product::getCreatedAt, Comparator.nullsLast(Comparator.reverseOrder())));
        }

        return products.stream().map(this::toMap).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public Map<String, Object> getById(String idOrSlug) {
        Product product = productRepository.findById(idOrSlug)
                .or(() -> productRepository.findBySlug(idOrSlug))
                .orElseThrow(() -> ApiException.notFound("Product not found"));

        Map<String, Object> map = toMap(product);

        List<Product> related = productRepository.findByCategoryId(product.getCategory().getId()).stream()
                .filter(p -> !p.getId().equals(product.getId()))
                .limit(4)
                .toList();
        map.put("related", related.stream().map(this::toMap).collect(Collectors.toList()));

        List<Review> reviews = reviewRepository.findByProductIdAndIsApprovedTrue(product.getId());
        map.put("reviews", reviews.stream().map(this::reviewToMap).collect(Collectors.toList()));

        return map;
    }

    @Transactional
    public Map<String, Object> create(Map<String, Object> body) {
        Category category = resolveCategory(body.get("categoryId"));
        Product p = Product.builder()
                .id(IdGenerator.uuid("prd"))
                .name((String) body.get("name"))
                .slug(slugify((String) body.get("name")))
                .category(category)
                .price(toBigDecimal(body.get("price")))
                .originalPrice(body.get("originalPrice") != null ? toBigDecimal(body.get("originalPrice")) : null)
                .goldPurity(Product.GoldPurity.fromFrontend((String) body.get("goldPurity")))
                .weightGrams(toBigDecimal(body.get("weightGrams")))
                .description((String) body.get("description"))
                .inStock(body.get("inStock") == null || Boolean.TRUE.equals(body.get("inStock")))
                .stockCount(body.get("stockCount") != null ? ((Number) body.get("stockCount")).intValue() : 0)
                .isFeatured(Boolean.TRUE.equals(body.get("isFeatured")))
                .isNewArrival(Boolean.TRUE.equals(body.get("isNewArrival")))
                .isBestSeller(Boolean.TRUE.equals(body.get("isBestSeller")))
                .images(extractImages(body.get("images")))
                .build();

        productRepository.save(p);
        return toMap(p);
    }

    @Transactional
    public Map<String, Object> update(String id, Map<String, Object> body) {
        Product p = productRepository.findById(id).orElseThrow(() -> ApiException.notFound("Product not found"));

        if (body.containsKey("name")) p.setName((String) body.get("name"));
        if (body.containsKey("price")) p.setPrice(toBigDecimal(body.get("price")));
        if (body.containsKey("originalPrice")) p.setOriginalPrice(toBigDecimal(body.get("originalPrice")));
        if (body.containsKey("goldPurity")) p.setGoldPurity(Product.GoldPurity.fromFrontend((String) body.get("goldPurity")));
        if (body.containsKey("weightGrams")) p.setWeightGrams(toBigDecimal(body.get("weightGrams")));
        if (body.containsKey("description")) p.setDescription((String) body.get("description"));
        if (body.containsKey("inStock")) p.setInStock(Boolean.TRUE.equals(body.get("inStock")));
        if (body.containsKey("stockCount")) p.setStockCount(((Number) body.get("stockCount")).intValue());
        if (body.containsKey("isFeatured")) p.setIsFeatured(Boolean.TRUE.equals(body.get("isFeatured")));
        if (body.containsKey("isNewArrival")) p.setIsNewArrival(Boolean.TRUE.equals(body.get("isNewArrival")));
        if (body.containsKey("isBestSeller")) p.setIsBestSeller(Boolean.TRUE.equals(body.get("isBestSeller")));
        if (body.containsKey("images")) p.setImages(extractImages(body.get("images")));
        if (body.containsKey("categoryId")) p.setCategory(resolveCategory(body.get("categoryId")));

        productRepository.save(p);
        return toMap(p);
    }

    @Transactional
    public void delete(String id) {
        if (!productRepository.existsById(id)) throw ApiException.notFound("Product not found");
        productRepository.deleteById(id);
    }

    public Map<String, Object> toMap(Product p) {
        Map<String, Object> m = new LinkedHashMap<>();
        m.put("id", p.getId());
        m.put("name", p.getName());
        m.put("slug", p.getSlug());
        m.put("categoryId", p.getCategory().getId());
        m.put("categoryName", p.getCategory().getName());
        m.put("price", p.getPrice());
        m.put("originalPrice", p.getOriginalPrice());
        m.put("goldPurity", p.getGoldPurity().toFrontend());
        m.put("weightGrams", p.getWeightGrams());
        m.put("description", p.getDescription());
        m.put("inStock", p.getInStock());
        m.put("stockCount", p.getStockCount());
        m.put("images", p.getImages() != null ? new ArrayList<>(p.getImages()) : List.of());
        m.put("isFeatured", p.getIsFeatured());
        m.put("isNewArrival", p.getIsNewArrival());
        m.put("isBestSeller", p.getIsBestSeller());
        m.put("rating", p.getRating());
        m.put("reviewCount", p.getReviewCount());
        m.put("createdAt", p.getCreatedAt() != null ? p.getCreatedAt().toString() : null);
        return m;
    }

    private Map<String, Object> reviewToMap(Review r) {
        Map<String, Object> m = new LinkedHashMap<>();
        m.put("id", r.getId());
        m.put("productId", r.getProduct().getId());
        m.put("userId", r.getUser().getId());
        m.put("userName", r.getUserName());
        m.put("rating", r.getRating());
        m.put("title", r.getTitle());
        m.put("comment", r.getComment());
        m.put("isApproved", r.getIsApproved());
        m.put("helpfulVotes", r.getHelpfulVotes());
        m.put("createdAt", r.getCreatedAt() != null ? r.getCreatedAt().toString() : null);
        return m;
    }

    private Category resolveCategory(Object id) {
        if (id == null) throw ApiException.badRequest("categoryId is required");
        return categoryRepository.findById(id.toString())
                .orElseThrow(() -> ApiException.notFound("Category not found"));
    }

    private BigDecimal toBigDecimal(Object v) {
        if (v == null) return null;
        if (v instanceof Number n) return BigDecimal.valueOf(n.doubleValue());
        return new BigDecimal(v.toString());
    }

    @SuppressWarnings("unchecked")
    private List<String> extractImages(Object images) {
        if (images instanceof List<?> list) {
            return list.stream().map(Object::toString).collect(Collectors.toList());
        }
        return new ArrayList<>();
    }

    private String slugify(String name) {
        return name.toLowerCase().replaceAll("[^a-z0-9]+", "-").replaceAll("^-|-$", "")
                + "-" + UUID.randomUUID().toString().substring(0, 6);
    }
}