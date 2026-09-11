package com.example.gayangold.service;

import com.example.gayangold.entity.GiftOfferRecord;
import com.example.gayangold.repository.GiftOfferRecordRepository;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Service
@RequiredArgsConstructor
public class GiftOfferAdminService {
    private final GiftOfferRecordRepository repository;
    private final ObjectMapper objectMapper;

    private Map<String,Object> toMap(GiftOfferRecord record) {
        try {
            Map<String,Object> map = objectMapper.readValue(record.getPayload(), new TypeReference<>() {});
            map.put("id", record.getId());
            map.put("active", record.getActive());
            map.put("createdAt", record.getCreatedAt());
            map.put("updatedAt", record.getUpdatedAt());
            return map;
        } catch (Exception e) { throw new IllegalStateException("Invalid stored Gift & Offers data", e); }
    }

    public List<Map<String,Object>> list(String type) {
        return repository.findAllByRecordTypeOrderByUpdatedAtDesc(type).stream().map(this::toMap).toList();
    }

    @Transactional
    public Map<String,Object> create(String type, Map<String,Object> data) {
        Map<String,Object> copy = new LinkedHashMap<>(data);
        copy.remove("id");
        String id = "gft-" + UUID.randomUUID().toString();
        boolean active = !Boolean.FALSE.equals(copy.get("active"));
        GiftOfferRecord record = GiftOfferRecord.builder().id(id).recordType(type)
                .payload(write(copy)).active(active).build();
        return toMap(repository.save(record));
    }

    @Transactional
    public Map<String,Object> update(String type, String id, Map<String,Object> data) {
        GiftOfferRecord record = repository.findById(id).orElseThrow(() -> new NoSuchElementException("Record not found: " + id));
        if (!type.equals(record.getRecordType())) throw new NoSuchElementException("Record not found: " + id);
        Map<String,Object> copy = new LinkedHashMap<>(data);
        copy.remove("id");
        record.setPayload(write(copy));
        record.setActive(!Boolean.FALSE.equals(copy.get("active")));
        return toMap(repository.save(record));
    }

    @Transactional
    public void delete(String type, String id) {
        GiftOfferRecord record = repository.findById(id).orElseThrow(() -> new NoSuchElementException("Record not found: " + id));
        if (!type.equals(record.getRecordType())) throw new NoSuchElementException("Record not found: " + id);
        repository.delete(record);
    }

    @Transactional
    public List<Map<String,Object>> replaceHomepage(List<Map<String,Object>> sections) {
        repository.deleteAll(repository.findAllByRecordTypeOrderByUpdatedAtDesc("HOMEPAGE"));
        List<Map<String,Object>> result = new ArrayList<>();
        for (Map<String,Object> section : sections) {
            Map<String,Object> copy = new LinkedHashMap<>(section);
            String id = Objects.toString(copy.get("id"), "home-" + UUID.randomUUID());
            copy.remove("id");
            GiftOfferRecord record = GiftOfferRecord.builder().id(id).recordType("HOMEPAGE")
                    .payload(write(copy)).active(!Boolean.FALSE.equals(copy.get("active"))).build();
            result.add(toMap(repository.save(record)));
        }
        return result;
    }

    private String write(Map<String,Object> data) {
        try { return objectMapper.writeValueAsString(data); }
        catch (Exception e) { throw new IllegalArgumentException("Invalid Gift & Offers payload", e); }
    }
}
