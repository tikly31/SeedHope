package com.example.seedhope.seedhope.controller;

import com.example.seedhope.seedhope.model.Campaign;
import com.example.seedhope.seedhope.service.PaymentStatusService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class PaymentStatusController {

    private final PaymentStatusService paymentStatusService;

    @Autowired
    public PaymentStatusController(PaymentStatusService paymentStatusService) {
        this.paymentStatusService = paymentStatusService;
    }

    @GetMapping("/campaign/trending")
    public ResponseEntity<List<Campaign>> getTrendingCampaigns() {
        List<Campaign> trendingCampaigns = paymentStatusService.getTrendingCampaigns();
        return ResponseEntity.ok(trendingCampaigns);
    }
}
