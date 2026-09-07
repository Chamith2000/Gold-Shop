package com.example.gayangold.repository;

import com.example.gayangold.entity.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface AppointmentRepository extends JpaRepository<Appointment, String> {
    List<Appointment> findByUserIdOrderByDateDesc(String userId);
    List<Appointment> findByDate(LocalDate date);
    List<Appointment> findByStatus(Appointment.Status status);
    long countByDateAndTimeSlot(LocalDate date, String timeSlot);
}
