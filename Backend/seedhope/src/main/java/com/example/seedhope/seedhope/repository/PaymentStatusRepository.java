package com.example.seedhope.seedhope.repository;

import com.example.seedhope.seedhope.model.Campaign;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface PaymentStatusRepository extends CrudRepository<Campaign, Long> {

    @Query("SELECT c FROM Campaign c " +
            "JOIN PaymentStatus p ON c.id = CAST(p.campaignId AS long) " + // Convert campaignId to Long
            "WHERE p.createdAt > :recentTimeFrame " +
            "AND c.status = 'APPROVED' " +  // Filter only approved campaigns
            "GROUP BY c.id " +
            "ORDER BY COUNT(p.transactionId) DESC")
    List<Campaign> findTrendingCampaigns(LocalDateTime recentTimeFrame);
}


