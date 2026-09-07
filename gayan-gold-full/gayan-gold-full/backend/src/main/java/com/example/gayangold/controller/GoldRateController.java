package com.example.gayangold.controller;

import com.example.gayangold.entity.GoldRate;
import com.example.gayangold.service.GoldRateService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/gold-rates")
@RequiredArgsConstructor
public class GoldRateController {

    private final GoldRateService goldRateService;

    // Public endpoint for frontend to get today's rate
    @GetMapping("/today")
    public ResponseEntity<GoldRate> getTodayRate() {
        return ResponseEntity.ok(goldRateService.getTodayRate());
    }

    // Public endpoint for frontend graph
    @GetMapping("/history")
    public ResponseEntity<List<GoldRate>> getHistory() {
        return ResponseEntity.ok(goldRateService.getHistory(7));
    }

    // Admin only endpoint to update today's gold rate
    @PostMapping("/update")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<GoldRate> updateRate(@RequestBody Map<String, Object> body) {
        return ResponseEntity.ok(goldRateService.updateTodayRate(body));
    }
}