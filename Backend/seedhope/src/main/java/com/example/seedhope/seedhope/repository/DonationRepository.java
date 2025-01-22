package com.example.seedhope.seedhope.repository;

import com.example.seedhope.seedhope.model.Donation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DonationRepository extends JpaRepository<Donation, Long> {
    List<Donation> findByCampaignId(Long campaignId);

    List<Donation> findByUserId(Long userId);
}
