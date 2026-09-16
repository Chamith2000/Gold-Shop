package com.example.gayangold.service;

import com.example.gayangold.entity.LuckySpinRecord;
import com.example.gayangold.entity.RewardProfile;
import com.example.gayangold.entity.RewardTransaction;
import com.example.gayangold.entity.User;
import com.example.gayangold.exception.ApiException;
import com.example.gayangold.repository.LuckySpinRecordRepository;
import com.example.gayangold.repository.RewardProfileRepository;
import com.example.gayangold.repository.RewardTransactionRepository;
import com.example.gayangold.util.IdGenerator;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Duration;
import java.time.Instant;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Random;

@Service
@RequiredArgsConstructor
public class RewardService {
    private static final long COOLDOWN_SECONDS = 24 * 60 * 60;
    public static final int POINTS_PER_RUPEE = 100;
    private final RewardProfileRepository profileRepository;
    private final RewardTransactionRepository transactionRepository;
    private final LuckySpinRecordRepository spinRepository;
    private final AuthService authService;
    private final Random random = new Random();

    public Map<String, Object> getProfile(User user) {
        return authService.toProfileMap(getOrCreateProfile(user));
    }

    public List<Map<String, Object>> getHistory(User user) {
        return transactionRepository.findByUserIdOrderByCreatedAtDesc(user.getId()).stream().map(this::txMap).toList();
    }

    public List<Map<String, Object>> getSpinHistory(User user) {
        return spinRepository.findByUserIdOrderBySpunAtDesc(user.getId()).stream().map(this::spinMap).toList();
    }

    public Map<String, Object> getSpinStatus(User user) {
        List<Segment> segments = segments();
        LuckySpinRecord previous = spinRepository.findTopByUserIdOrderBySpunAtDesc(user.getId()).orElse(null);
        Instant next = previous == null ? null : previous.getNextEligibleAt();
        long remaining = next == null ? 0 : Math.max(0, Duration.between(Instant.now(), next).getSeconds());
        Map<String, Object> result = new HashMap<>();
        result.put("eligible", remaining == 0);
        result.put("secondsRemaining", remaining);
        result.put("lastSpunAt", previous == null ? null : previous.getSpunAt());
        result.put("nextEligibleAt", next);
        result.put("segments", segments.stream().map(Segment::toMap).toList());
        return result;
    }

    public Map<String, Object> calculateDiscount(User user, int pointsToRedeem, BigDecimal orderTotal) {
        RewardProfile profile = getOrCreateProfile(user);
        if (pointsToRedeem < 0) {
            throw ApiException.badRequest("Points to redeem cannot be negative.");
        }
        int availablePoints = profile.getCurrentPoints();
        int maxByOrder = orderTotal == null
                ? availablePoints
                : orderTotal.multiply(BigDecimal.valueOf(0.30))
                    .multiply(BigDecimal.valueOf(POINTS_PER_RUPEE))
                    .setScale(0, RoundingMode.FLOOR)
                    .intValue();
        int redeemablePoints = Math.min(pointsToRedeem, Math.min(availablePoints, Math.max(0, maxByOrder)));
        BigDecimal discountAmount = BigDecimal.valueOf(redeemablePoints)
                .divide(BigDecimal.valueOf(POINTS_PER_RUPEE), 2, RoundingMode.HALF_UP);
        Map<String, Object> result = new LinkedHashMap<>();
        result.put("pointsToRedeem", redeemablePoints);
        result.put("discountAmount", discountAmount);
        result.put("availablePointsAfter", availablePoints - redeemablePoints);
        result.put("currency", "LKR");
        result.put("conversionRate", "100 points = Rs. 1.00");
        return result;
    }

    @Transactional
    public Map<String, Object> spin(User user) {
        RewardProfile profile = getOrCreateProfile(user);
        LuckySpinRecord previous = spinRepository.findTopByUserIdOrderBySpunAtDesc(user.getId()).orElse(null);
        Instant now = Instant.now();
        if (previous != null && previous.getNextEligibleAt().isAfter(now)) {
            long remaining = Math.max(0, Duration.between(now, previous.getNextEligibleAt()).getSeconds());
            throw ApiException.conflict("Next spin available in " + formatRemaining(remaining));
        }

        Segment segment = weightedPick(profile.getRewardTier());
        int reward = (int) Math.round(segment.points * profile.getPointsMultiplier());
        Instant next = now.plusSeconds(COOLDOWN_SECONDS);

        profile.setCurrentPoints(profile.getCurrentPoints() + reward);
        profile.setLifetimeEarned(profile.getLifetimeEarned() + reward);
        profileRepository.save(profile);

        LuckySpinRecord record = LuckySpinRecord.builder().id(IdGenerator.uuid("spin")).user(user)
                .segmentId(segment.id).segmentName(segment.name).rewardPoints(reward).nextEligibleAt(next).build();
        spinRepository.save(record);

        RewardTransaction tx = RewardTransaction.builder().id(IdGenerator.uuid("rtx")).user(user)
                .type(RewardTransaction.Type.LUCKY_WHEEL).points(reward).reference(record.getId())
                .description(reward > 0 ? "Lucky Wheel reward: " + reward + " points" : "Lucky Wheel: Better Luck")
                .balanceAfter(profile.getCurrentPoints()).build();
        transactionRepository.save(tx);

        Map<String, Object> result = new HashMap<>();
        result.put("message", reward > 0 ? "Congratulations! You won " + reward + " points." : "Better luck next time!");
        result.put("winningSegment", segment.toMap());
        result.put("rewardPoints", reward);
        result.put("rewardValueRupees", BigDecimal.valueOf(reward)
                .divide(BigDecimal.valueOf(POINTS_PER_RUPEE), 2, RoundingMode.HALF_UP));
        result.put("rewardProfile", authService.toProfileMap(profile));
        result.put("nextEligibleAt", next);
        result.put("secondsRemaining", COOLDOWN_SECONDS);
        return result;
    }

    private RewardProfile getOrCreateProfile(User user) {
        return profileRepository.findByUserId(user.getId()).orElseGet(() -> profileRepository.save(RewardProfile.builder()
                .id(IdGenerator.uuid("rp")).user(user).currentPoints(0).lifetimeEarned(0)
                .rewardTier(RewardProfile.Tier.SILVER).pointsMultiplier(1.0).build()));
    }

    private Segment weightedPick(RewardProfile.Tier tier) {
        List<Segment> all = segments();
        double total = all.stream().mapToDouble(s -> s.weight * multiplierForTier(s.points, tier)).sum();
        double r = random.nextDouble() * total;
        for (Segment s : all) {
            r -= s.weight * multiplierForTier(s.points, tier);
            if (r <= 0) return s;
        }
        return all.get(0);
    }

    private double multiplierForTier(int points, RewardProfile.Tier tier) {
        if (points >= 500 && tier == RewardProfile.Tier.GOLD) return 1.5;
        if (points >= 500 && tier == RewardProfile.Tier.PLATINUM) return 2.5;
        if (points >= 250 && tier == RewardProfile.Tier.PLATINUM) return 2.0;
        return 1.0;
    }

    private List<Segment> segments() {
        List<Segment> s = new ArrayList<>();
        s.add(new Segment("seg-1", "50 Gold Pts", 50, 30));
        s.add(new Segment("seg-2", "100 Gold Pts", 100, 25));
        s.add(new Segment("seg-3", "250 Royal Pts", 250, 15));
        s.add(new Segment("seg-4", "500 Grand Pts", 500, 8));
        s.add(new Segment("seg-5", "1,000 Sovereign", 1000, 3));
        s.add(new Segment("seg-6", "Better Luck", 0, 15));
        s.add(new Segment("seg-7", "5,000 Empress", 5000, 3));
        s.add(new Segment("seg-8", "10,000 Crown", 10000, 1));
        return s;
    }

    private String formatRemaining(long seconds) {
        long h = seconds / 3600, m = (seconds % 3600) / 60, s = seconds % 60;
        return String.format("%02d:%02d:%02d", h, m, s);
    }

    private Map<String, Object> txMap(RewardTransaction t) {
        return Map.of("id", t.getId(), "userId", t.getUser().getId(), "type", t.getType().name(),
                "points", t.getPoints(), "reference", t.getReference() == null ? "" : t.getReference(),
                "description", t.getDescription(), "balanceAfter", t.getBalanceAfter(), "createdAt", t.getCreatedAt());
    }

    private Map<String, Object> spinMap(LuckySpinRecord s) {
        return Map.of("id", s.getId(), "userId", s.getUser().getId(), "segmentId", s.getSegmentId(),
                "segmentName", s.getSegmentName(), "rewardPoints", s.getRewardPoints(),
                "spunAt", s.getSpunAt(), "nextEligibleAt", s.getNextEligibleAt());
    }

    private record Segment(String id, String name, int points, double weight) {
        Map<String, Object> toMap() {
            return Map.of("id", id, "name", name, "rewardType", points > 0 ? "POINTS" : "BETTER_LUCK",
                    "rewardPoints", points, "probability", weight, "active", true,
                    "displayOrder", Integer.parseInt(id.substring(4)));
        }
    }
}
