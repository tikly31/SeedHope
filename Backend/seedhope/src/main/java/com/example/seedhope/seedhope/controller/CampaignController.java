package com.example.seedhope.seedhope.controller;

import com.example.seedhope.seedhope.model.Campaign;
import com.example.seedhope.seedhope.service.CampaignService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/campaigns")
public class CampaignController {

    private final CampaignService campaignService;

    public CampaignController(CampaignService campaignService) {
        this.campaignService = campaignService;
    }

    @PostMapping
    public ResponseEntity<Campaign> createCampaign(
            @RequestParam String title,
            @RequestParam String description,
            @RequestParam String category,
            @RequestParam Double goalAmount) {
        Campaign campaign = campaignService.createCampaign(title, description, category, goalAmount);
        return ResponseEntity.ok(campaign);
    }

    @GetMapping
    public ResponseEntity<List<Campaign>> getAllApprovedCampaigns() {
        return ResponseEntity.ok(campaignService.getAllApprovedCampaigns());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Campaign> getCampaignById(@PathVariable Long id) {
        return campaignService.getCampaignById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<Campaign> updateCampaignStatus(@PathVariable Long id, @RequestParam Campaign.Status status) {
        return ResponseEntity.ok(campaignService.updateCampaignStatus(id, status));
    }

    @GetMapping("/category")
    public ResponseEntity<List<Campaign>> getCampaignsByCategory(@RequestParam String category) {
        return ResponseEntity.ok(campaignService.getCampaignsByCategory(category));
    }
}
