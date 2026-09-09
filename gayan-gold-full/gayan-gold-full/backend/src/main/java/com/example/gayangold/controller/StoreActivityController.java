package com.example.gayangold.controller;

import com.example.gayangold.entity.StoreActivity;
import com.example.gayangold.entity.User;
import com.example.gayangold.service.StoreActivityService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/store-activity")
@RequiredArgsConstructor
public class StoreActivityController {

    private final StoreActivityService storeActivityService;

    @GetMapping("/live")
    public ResponseEntity<StoreActivity> getLive() {
        return ResponseEntity.ok(storeActivityService.getLive());
    }

    @GetMapping("/today")
    public ResponseEntity<Map<String, Object>> getTodaySchedule() {
        return ResponseEntity.ok(storeActivityService.getTodaySchedule());
    }

    @PutMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<StoreActivity> update(
            @RequestBody Map<String, Object> body,
            @AuthenticationPrincipal User user) {
        String updatedBy = user != null ? user.getEmail() : "admin";
        return ResponseEntity.ok(storeActivityService.updateActivity(body, updatedBy));
    }
}