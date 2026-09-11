package com.example.gayangold.repository;

import com.example.gayangold.entity.GiftOfferRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface GiftOfferRecordRepository extends JpaRepository<GiftOfferRecord, String> {
    List<GiftOfferRecord> findAllByRecordTypeOrderByUpdatedAtDesc(String recordType);
    List<GiftOfferRecord> findAllByRecordTypeOrderByActiveDescUpdatedAtDesc(String recordType);
}
