package com.example.seedhope.seedhope.service;

import com.example.seedhope.seedhope.model.Campaign;
import com.example.seedhope.seedhope.repository.PaymentStatusRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class PaymentStatusService {

    private final PaymentStatusRepository paymentStatusRepository;

    @Autowired
    public PaymentStatusService(PaymentStatusRepository paymentStatusRepository) {
        this.paymentStatusRepository = paymentStatusRepository;
    }

    public List<Campaign> getTrendingCampaigns() {
        // Define the time frame (e.g., last 7 days)
        LocalDateTime recentTimeFrame = LocalDateTime.now().minusDays(7);

        // Fetch the trending campaigns as full Campaign entities
        return paymentStatusRepository.findTrendingCampaigns(recentTimeFrame);
    }
}
