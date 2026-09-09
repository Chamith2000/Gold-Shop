package com.example.gayangold.controller;

import com.example.gayangold.entity.User;
import com.example.gayangold.exception.ApiException;
import com.example.gayangold.service.AppointmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/appointments")
@RequiredArgsConstructor
public class AppointmentController {

    private final AppointmentService appointmentService;

    @GetMapping("/availability")
    public ResponseEntity<Map<String, Object>> getAvailability(
            @RequestParam String date,
            @RequestParam(required = false) String appointmentType) {
        LocalDate parsedDate = LocalDate.parse(date);
        return ResponseEntity.ok(appointmentService.getAvailability(parsedDate, appointmentType));
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> book(
            @RequestBody Map<String, Object> body,
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(appointmentService.book(body, user));
    }

    @GetMapping("/my-appointments")
    public ResponseEntity<List<Map<String, Object>>> getMyAppointments(@AuthenticationPrincipal User user) {
        if (user == null) {
            throw ApiException.unauthorized("Please sign in to view your appointments.");
        }
        return ResponseEntity.ok(appointmentService.getMyAppointments(user.getId()));
    }

    @GetMapping("/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Map<String, Object>>> getAll(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String date) {
        LocalDate parsedDate = date != null ? LocalDate.parse(date) : null;
        return ResponseEntity.ok(appointmentService.getAll(status, parsedDate));
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> updateStatus(
            @PathVariable String id,
            @RequestBody Map<String, String> body) {
        return ResponseEntity.ok(appointmentService.updateStatus(id, body.get("status")));
    }
}