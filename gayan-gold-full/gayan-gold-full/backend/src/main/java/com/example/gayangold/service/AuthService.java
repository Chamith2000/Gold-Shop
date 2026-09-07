package com.example.gayangold.service;

import com.example.gayangold.dto.request.LoginRequest;
import com.example.gayangold.dto.request.RegisterRequest;
import com.example.gayangold.entity.RewardProfile;
import com.example.gayangold.entity.User;
import com.example.gayangold.exception.ApiException;
import com.example.gayangold.repository.RewardProfileRepository;
import com.example.gayangold.repository.UserRepository;
import com.example.gayangold.security.JwtUtil;
import com.example.gayangold.util.IdGenerator;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final RewardProfileRepository rewardProfileRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    @Transactional
    public Map<String, Object> register(RegisterRequest req) {
        if (userRepository.existsByEmail(req.getEmail().toLowerCase().trim())) {
            throw ApiException.conflict("Email already registered");
        }
        User user = User.builder()
                .id(IdGenerator.uuid("usr"))
                .fullName(req.getFullName().trim())
                .email(req.getEmail().toLowerCase().trim())
                .passwordHash(passwordEncoder.encode(req.getPassword()))
                .phone(req.getPhone())
                .role(User.Role.CUSTOMER)
                .status(User.Status.ACTIVE)
                .build();
        userRepository.save(user);

        RewardProfile profile = RewardProfile.builder()
                .id(IdGenerator.uuid("rp"))
                .user(user)
                .currentPoints(500) // welcome points
                .lifetimeEarned(500)
                .rewardTier(RewardProfile.Tier.SILVER)
                .pointsMultiplier(1.0)
                .build();
        rewardProfileRepository.save(profile);

        String token = jwtUtil.generateToken(user.getId(), user.getEmail(), user.getRole().name());
        return authResponse(token, user, profile);
    }

    public Map<String, Object> login(LoginRequest req) {
        User user = userRepository.findByEmail(req.getEmail().toLowerCase().trim())
                .orElseThrow(() -> ApiException.unauthorized("Invalid email or password"));
        if (!passwordEncoder.matches(req.getPassword(), user.getPasswordHash())) {
            throw ApiException.unauthorized("Invalid email or password");
        }
        if (user.getStatus() != User.Status.ACTIVE) {
            throw ApiException.forbidden("Account is not active");
        }
        RewardProfile profile = rewardProfileRepository.findByUserId(user.getId())
                .orElseGet(() -> createDefaultProfile(user));
        String token = jwtUtil.generateToken(user.getId(), user.getEmail(), user.getRole().name());
        return authResponse(token, user, profile);
    }

    public Map<String, Object> me(User user) {
        RewardProfile profile = rewardProfileRepository.findByUserId(user.getId())
                .orElseGet(() -> createDefaultProfile(user));
        Map<String, Object> result = new HashMap<>();
        result.put("user", toUserMap(user));
        result.put("rewardProfile", toProfileMap(profile));
        return result;
    }

    @Transactional
    public Map<String, Object> updateProfile(User user, String fullName, String phone) {
        if (fullName != null && !fullName.isBlank()) user.setFullName(fullName.trim());
        if (phone != null) user.setPhone(phone);
        userRepository.save(user);
        Map<String, Object> result = new HashMap<>();
        result.put("user", toUserMap(user));
        result.put("message", "Profile updated successfully");
        return result;
    }

    private RewardProfile createDefaultProfile(User user) {
        RewardProfile p = RewardProfile.builder()
                .id(IdGenerator.uuid("rp"))
                .user(user)
                .currentPoints(0)
                .lifetimeEarned(0)
                .rewardTier(RewardProfile.Tier.SILVER)
                .pointsMultiplier(1.0)
                .build();
        return rewardProfileRepository.save(p);
    }

    private Map<String, Object> authResponse(String token, User user, RewardProfile profile) {
        Map<String, Object> result = new HashMap<>();
        result.put("token", token);
        result.put("user", toUserMap(user));
        result.put("rewardProfile", toProfileMap(profile));
        result.put("message", "Success");
        return result;
    }

    private Map<String, Object> toUserMap(User u) {
        Map<String, Object> m = new HashMap<>();
        m.put("id", u.getId());
        m.put("fullName", u.getFullName());
        m.put("email", u.getEmail());
        m.put("phone", u.getPhone());
        m.put("role", u.getRole().name());
        m.put("status", u.getStatus().name());
        m.put("createdAt", u.getCreatedAt() != null ? u.getCreatedAt().toString() : null);
        return m;
    }

    private Map<String, Object> toProfileMap(RewardProfile p) {
        Map<String, Object> m = new HashMap<>();
        m.put("id", p.getId());
        m.put("userId", p.getUser().getId());
        m.put("currentPoints", p.getCurrentPoints());
        m.put("lifetimeEarned", p.getLifetimeEarned());
        m.put("lifetimeRedeemed", p.getLifetimeRedeemed());
        m.put("rewardTier", p.getRewardTier().name());
        m.put("pointsMultiplier", p.getPointsMultiplier());
        return m;
    }
}
