package com.example.gayangold.service;

import com.example.gayangold.entity.Appointment;
import com.example.gayangold.entity.User;
import com.example.gayangold.exception.ApiException;
import com.example.gayangold.repository.AppointmentRepository;
import com.example.gayangold.repository.StoreActivityRepository;
import com.example.gayangold.util.IdGenerator;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final StoreActivityRepository storeActivityRepository;

    private static final List<String> DAILY_SLOTS = List.of(
            "09:00", "10:00", "11:00", "12:00", "13:00",
            "14:00", "15:00", "16:00", "17:00", "18:00"
    );
    private static final int SLOT_CAPACITY = 3;

    @Transactional(readOnly = true)
    public Map<String, Object> getAvailability(LocalDate date, String appointmentType) {
        String currentTraffic = storeActivityRepository.findFirstByOrderByUpdatedAtDesc()
                .map(a -> a.getTrafficLevel().name())
                .orElse("LOW");
        int currentWait = storeActivityRepository.findFirstByOrderByUpdatedAtDesc()
                .map(a -> a.getEstimatedWaitMinutes())
                .orElse(0);

        List<Map<String, Object>> slots = new ArrayList<>();
        boolean recommendedPicked = false;

        for (String time : DAILY_SLOTS) {
            long booked = appointmentRepository.countByDateAndTimeSlot(date, time);
            boolean available = booked < SLOT_CAPACITY;
            String status = !available ? "FULL" : "AVAILABLE";
            boolean isRecommended = false;

            if (available && !recommendedPicked) {
                isRecommended = true;
                status = "RECOMMENDED";
                recommendedPicked = true;
            }

            Map<String, Object> slot = new LinkedHashMap<>();
            slot.put("time", time);
            slot.put("available", available);
            slot.put("bookedCount", booked);
            slot.put("capacity", SLOT_CAPACITY);
            slot.put("trafficLevel", currentTraffic);
            slot.put("isRecommended", isRecommended);
            slot.put("status", status);
            slots.add(slot);
        }

        Map<String, Object> response = new LinkedHashMap<>();
        response.put("date", date.toString());
        response.put("appointmentType", appointmentType);
        response.put("currentStoreTraffic", currentTraffic);
        response.put("currentWaitTime", currentWait);
        response.put("slots", slots);
        return response;
    }

    @Transactional
    public Map<String, Object> book(Map<String, Object> body, User user) {
        if (user == null) {
            throw ApiException.unauthorized("Please sign in to book a VIP appointment.");
        }

        LocalDate date = LocalDate.parse((String) body.get("date"));
        String timeSlot = (String) body.get("timeSlot");
        String appointmentType = (String) body.get("appointmentType");

        if (timeSlot == null || timeSlot.isBlank()) {
            throw ApiException.badRequest("Please select a valid time slot.");
        }

        long booked = appointmentRepository.countByDateAndTimeSlot(date, timeSlot);
        if (booked >= SLOT_CAPACITY) {
            throw ApiException.conflict("This time slot is now fully booked. Please choose another.");
        }

        Integer visitorCount = body.get("visitorCount") != null
                ? Integer.parseInt(body.get("visitorCount").toString())
                : 1;

        Appointment appointment = Appointment.builder()
                .id(IdGenerator.uuid("apt"))
                .appointmentNumber(IdGenerator.appointmentNumber())
                .user(user)
                .customerName(user.getFullName())
                .customerEmail(user.getEmail())
                .customerPhone(user.getPhone())
                .date(date)
                .timeSlot(timeSlot)
                .appointmentType(appointmentType != null ? appointmentType : "General Consultation")
                .visitorCount(visitorCount)
                .notes((String) body.get("notes"))
                .status(Appointment.Status.PENDING)
                .build();

        Appointment saved = appointmentRepository.save(appointment);
        return toMap(saved);
    }

    @Transactional(readOnly = true)
    public List<Map<String, Object>> getMyAppointments(String userId) {
        return appointmentRepository.findByUserIdOrderByDateDesc(userId)
                .stream().map(this::toMap).toList();
    }

    @Transactional(readOnly = true)
    public List<Map<String, Object>> getAll(String status, LocalDate date) {
        List<Appointment> appointments;
        if (status != null && !status.isBlank()) {
            appointments = appointmentRepository.findByStatus(Appointment.Status.valueOf(status));
        } else if (date != null) {
            appointments = appointmentRepository.findByDate(date);
        } else {
            appointments = appointmentRepository.findAll();
        }
        return appointments.stream().map(this::toMap).toList();
    }

    @Transactional
    public Map<String, Object> updateStatus(String id, String status) {
        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> ApiException.notFound("Appointment not found: " + id));
        appointment.setStatus(Appointment.Status.valueOf(status));
        return toMap(appointmentRepository.save(appointment));
    }

    private Map<String, Object> toMap(Appointment a) {
        Map<String, Object> m = new LinkedHashMap<>();
        m.put("id", a.getId());
        m.put("appointmentNumber", a.getAppointmentNumber());
        m.put("userId", a.getUser() != null ? a.getUser().getId() : null);
        m.put("customerName", a.getCustomerName());
        m.put("customerEmail", a.getCustomerEmail());
        m.put("customerPhone", a.getCustomerPhone());
        m.put("date", a.getDate() != null ? a.getDate().toString() : null);
        m.put("timeSlot", a.getTimeSlot());
        m.put("appointmentType", a.getAppointmentType());
        m.put("visitorCount", a.getVisitorCount());
        m.put("notes", a.getNotes());
        m.put("status", a.getStatus().name());
        m.put("storeTrafficLevel", a.getStoreTrafficLevel() != null ? a.getStoreTrafficLevel().name() : null);
        m.put("createdAt", a.getCreatedAt() != null ? a.getCreatedAt().toString() : null);
        return m;
    }
}