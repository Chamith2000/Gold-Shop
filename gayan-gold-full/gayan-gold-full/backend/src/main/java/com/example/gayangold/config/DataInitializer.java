package com.example.gayangold.config;

import com.example.gayangold.entity.*;
import com.example.gayangold.repository.*;
import com.example.gayangold.util.IdGenerator;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final RewardProfileRepository rewardProfileRepository;
    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;
    private final GoldRateRepository goldRateRepository;
    private final StoreActivityRepository storeActivityRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (userRepository.count() > 0) {
            log.info("Database already seeded, skipping.");
            return;
        }
        log.info("Seeding initial Gayan Gold data...");

        // Admins (same emails as original frontend seed)
        createAdmin("usr-admin-1", "Janendra Silva (Director)", "janendra.silva2001@gmail.com", "AdminGold2026!", "+94 77 123 4567");
        createAdmin("usr-admin-2", "Executive Boutique Admin", "admin@gayangoldhouse.lk", "AdminGold2026!", "+94 11 234 5678");
        createAdmin("usr-admin-3", "Boutique Manager (Gayan Gold)", "admin@gayangold.com", "AdminGold2026!", "+94 77 999 8888");

        // Demo customer
        User customer = User.builder()
                .id("usr-customer-1")
                .fullName("Demo Customer")
                .email("customer@example.com")
                .passwordHash(passwordEncoder.encode("gold123"))
                .phone("+94 71 000 0000")
                .role(User.Role.CUSTOMER)
                .status(User.Status.ACTIVE)
                .build();
        userRepository.save(customer);
        rewardProfileRepository.save(RewardProfile.builder()
                .id(IdGenerator.uuid("rp"))
                .user(customer)
                .currentPoints(500)
                .lifetimeEarned(500)
                .rewardTier(RewardProfile.Tier.SILVER)
                .pointsMultiplier(1.0)
                .build());

        // Categories
        Category rings = saveCat("cat-rings", "Rings", "rings", "Exquisite gold rings", 1);
        Category necklaces = saveCat("cat-necklaces", "Necklaces", "necklaces", "Elegant gold necklaces", 2);
        Category bracelets = saveCat("cat-bracelets", "Bracelets", "bracelets", "Fine gold bracelets", 3);
        Category earrings = saveCat("cat-earrings", "Earrings", "earrings", "Beautiful gold earrings", 4);

        // Sample products
        saveProduct("prd-1", "Royal 22K Gold Ring", rings, "85000", "22K", "8.5", true, true);
        saveProduct("prd-2", "Classic Gold Necklace", necklaces, "185000", "22K", "22.0", true, false);
        saveProduct("prd-3", "Diamond Accent Bracelet", bracelets, "125000", "18K", "15.2", false, true);
        saveProduct("prd-4", "Traditional Jhumka Earrings", earrings, "45000", "22K", "6.8", true, true);

        // Gold rates (today + history)
        BigDecimal base24 = new BigDecimal("31050");
        for (int i = 7; i >= 0; i--) {
            LocalDate d = LocalDate.now().minusDays(i);
            BigDecimal variance = BigDecimal.valueOf((7 - i) * 65 - (i % 2 == 0 ? 30 : -45));
            BigDecimal r24 = base24.add(variance);
            BigDecimal r22 = r24.multiply(new BigDecimal("0.916")).setScale(2, java.math.RoundingMode.HALF_UP);
            BigDecimal r18 = r24.multiply(new BigDecimal("0.75")).setScale(2, java.math.RoundingMode.HALF_UP);
            goldRateRepository.save(GoldRate.builder()
                    .id("gr-" + d)
                    .date(d)
                    .rate24k(r24)
                    .rate22k(r22)
                    .rate18k(r18)
                    .sovereign24k(r24.multiply(BigDecimal.valueOf(8)))
                    .sovereign22k(r22.multiply(BigDecimal.valueOf(8)))
                    .currency("LKR")
                    .build());
        }

        storeActivityRepository.save(StoreActivity.builder()
                .id("store-1")
                .currentVisitorCount(12)
                .trafficLevel(StoreActivity.TrafficLevel.MODERATE)
                .estimatedWaitMinutes(15)
                .storeStatus(StoreActivity.StoreStatus.OPEN)
                .peakHoursNote("Peak hours typically 11:00–14:00 and 17:00–19:00")
                .updatedBy("system")
                .build());

        log.info("Seed completed. Admin login: admin@gayangold.com / AdminGold2026!");
    }

    private void createAdmin(String id, String name, String email, String password, String phone) {
        User u = User.builder()
                .id(id)
                .fullName(name)
                .email(email)
                .passwordHash(passwordEncoder.encode(password))
                .phone(phone)
                .role(User.Role.ADMIN)
                .status(User.Status.ACTIVE)
                .build();
        userRepository.save(u);
        rewardProfileRepository.save(RewardProfile.builder()
                .id(IdGenerator.uuid("rp"))
                .user(u)
                .currentPoints(0)
                .lifetimeEarned(0)
                .rewardTier(RewardProfile.Tier.PLATINUM)
                .pointsMultiplier(1.5)
                .build());
    }

    private Category saveCat(String id, String name, String slug, String desc, int order) {
        Category c = Category.builder()
                .id(id)
                .name(name)
                .slug(slug)
                .description(desc)
                .imageUrl("")
                .displayOrder(order)
                .active(true)
                .build();
        return categoryRepository.save(c);
    }

    private void saveProduct(String id, String name, Category cat, String price, String purity, String weight, boolean featured, boolean newArr) {
        Product p = Product.builder()
                .id(id)
                .name(name)
                .slug(name.toLowerCase().replaceAll("[^a-z0-9]+", "-"))
                .category(cat)
                .price(new BigDecimal(price))
                .goldPurity(Product.GoldPurity.fromFrontend(purity))
                .weightGrams(new BigDecimal(weight))
                .description("Handcrafted " + name + " by Gayan Gold House.")
                .inStock(true)
                .stockCount(10)
                .isFeatured(featured)
                .isNewArrival(newArr)
                .isBestSeller(false)
                .images(List.of())
                .build();
        productRepository.save(p);
    }
}
