package com.example.gayangold.controller;

import com.example.gayangold.entity.User;
import com.example.gayangold.service.RewardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/rewards")
@RequiredArgsConstructor
public class RewardController {
    private final RewardService rewardService;

    @GetMapping("/profile")
    public ResponseEntity<Map<String, Object>> profile(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(rewardService.getProfile(user));
    }

    @GetMapping("/history")
    public ResponseEntity<List<Map<String, Object>>> history(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(rewardService.getHistory(user));
    }

    @GetMapping("/spin/status")
    public ResponseEntity<Map<String, Object>> spinStatus(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(rewardService.getSpinStatus(user));
    }

    @PostMapping("/spin")
    public ResponseEntity<Map<String, Object>> spin(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(rewardService.spin(user));
    }

    @GetMapping("/spin/history")
    public ResponseEntity<List<Map<String, Object>>> spinHistory(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(rewardService.getSpinHistory(user));
    }
}
