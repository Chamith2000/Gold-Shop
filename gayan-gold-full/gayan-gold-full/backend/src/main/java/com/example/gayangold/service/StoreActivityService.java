package com.example.gayangold.service;

import com.example.gayangold.entity.StoreActivity;
import com.example.gayangold.repository.StoreActivityRepository;
import com.example.gayangold.util.IdGenerator;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class StoreActivityService {

    private final StoreActivityRepository storeActivityRepository;

    @Transactional(readOnly = true)
    public StoreActivity getLive() {
        return storeActivityRepository.findFirstByOrderByUpdatedAtDesc()
                .orElseGet(() -> StoreActivity.builder()
                        .id("store-default")
                        .currentVisitorCount(0)
                        .trafficLevel(StoreActivity.TrafficLevel.LOW)
                        .estimatedWaitMinutes(0)
                        .storeStatus(StoreActivity.StoreStatus.OPEN)
                        .peakHoursNote("Store activity has not been recorded yet.")
                        .recordedAt(Instant.now())
                        .build());
    }

    @Transactional(readOnly = true)
    public Map<String, Object> getTodaySchedule() {
        StoreActivity activity = getLive();

        List<Map<String, String>> schedule = List.of(
                scheduleEntry("09:00 - 11:00", "LOW", "0-5 min", "Best time for private consultations."),
                scheduleEntry("11:00 - 14:00", "HIGH", "15-20 min", "Peak hours — consider booking an appointment."),
                scheduleEntry("14:00 - 17:00", "MODERATE", "5-10 min", "Steady footfall, walk-ins welcome."),
                scheduleEntry("17:00 - 19:00", "HIGH", "15-20 min", "Evening peak — booking recommended."),
                scheduleEntry("19:00 - 21:00", "LOW", "0-5 min", "Quiet hours, ideal for bespoke viewings.")
        );

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("activity", activity);
        result.put("schedule", schedule);
        return result;
    }

    private Map<String, String> scheduleEntry(String time, String traffic, String wait, String recommendation) {
        Map<String, String> entry = new LinkedHashMap<>();
        entry.put("time", time);
        entry.put("traffic", traffic);
        entry.put("wait", wait);
        entry.put("recommendation", recommendation);
        return entry;
    }

    @Transactional
    public StoreActivity updateActivity(Map<String, Object> body, String updatedByEmail) {
        StoreActivity activity = storeActivityRepository.findFirstByOrderByUpdatedAtDesc()
                .orElseGet(() -> StoreActivity.builder()
                        .id(IdGenerator.uuid("store"))
                        .build());

        if (body.containsKey("currentVisitorCount")) {
            activity.setCurrentVisitorCount(Integer.parseInt(body.get("currentVisitorCount").toString()));
        }
        if (body.containsKey("trafficLevel")) {
            activity.setTrafficLevel(StoreActivity.TrafficLevel.valueOf(body.get("trafficLevel").toString()));
        }
        if (body.containsKey("estimatedWaitMinutes")) {
            activity.setEstimatedWaitMinutes(Integer.parseInt(body.get("estimatedWaitMinutes").toString()));
        }
        if (body.containsKey("storeStatus")) {
            activity.setStoreStatus(StoreActivity.StoreStatus.valueOf(body.get("storeStatus").toString()));
        }
        if (body.containsKey("peakHoursNote")) {
            activity.setPeakHoursNote((String) body.get("peakHoursNote"));
        }

        activity.setRecordedAt(Instant.now());
        activity.setUpdatedBy(updatedByEmail);

        return storeActivityRepository.save(activity);
    }
}