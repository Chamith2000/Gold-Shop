package com.example.gayangold.service;

import com.example.gayangold.entity.GoldRate;
import com.example.gayangold.repository.GoldRateRepository;
import com.example.gayangold.util.IdGenerator;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class GoldRateService {

    private final GoldRateRepository goldRateRepository;

    public GoldRate getTodayRate() {
        return goldRateRepository.findFirstByOrderByDateDesc().orElse(null);
    }

    public List<GoldRate> getHistory(int days) {
        // Gets the most recent records based on the given days (default 7 as per frontend)
        return goldRateRepository.findTop8ByOrderByDateDesc();
    }

    @Transactional
    public GoldRate updateTodayRate(Map<String, Object> body) {
        LocalDate today = LocalDate.now();

        // Check if a rate already exists for today
        GoldRate goldRate = goldRateRepository.findByDate(today)
                .orElse(GoldRate.builder()
                        .id(IdGenerator.uuid("gr"))
                        .date(today)
                        .currency("LKR")
                        .build());

        // Update the rates from the admin input
        if (body.containsKey("rate24k")) {
            BigDecimal rate24k = new BigDecimal(body.get("rate24k").toString());
            goldRate.setRate24k(rate24k);
            goldRate.setSovereign24k(rate24k.multiply(BigDecimal.valueOf(8)));
        }
        if (body.containsKey("rate22k")) {
            BigDecimal rate22k = new BigDecimal(body.get("rate22k").toString());
            goldRate.setRate22k(rate22k);
            goldRate.setSovereign22k(rate22k.multiply(BigDecimal.valueOf(8)));
        }
        if (body.containsKey("rate18k")) {
            goldRate.setRate18k(new BigDecimal(body.get("rate18k").toString()));
        }

        return goldRateRepository.save(goldRate);
    }
}