package com.example.seedhope.seedhope.controller;

import com.example.seedhope.seedhope.model.Campaign;
import com.example.seedhope.seedhope.service.CampaignService;
import com.example.seedhope.seedhope.service.strategy.sorting.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@RestController
public class CampaignController {

    @Autowired
    private final CampaignService campaignService;

    public CampaignController(CampaignService campaignService) {
        this.campaignService = campaignService;
    }

    @PostMapping("/campaign")
    public ResponseEntity<Campaign> createCampaign(
            @RequestParam String title,
            @RequestParam String description,
            @RequestParam String category,
            @RequestParam Double goalAmount,
            @RequestParam LocalDate due_date,
            @RequestParam String photourl)
            {
        Campaign campaign = campaignService.createCampaign(title, description, category, goalAmount, due_date, photourl);
        return ResponseEntity.ok(campaign);
    }

    @GetMapping("/campaign")
    public ResponseEntity<List<Campaign>> getAllApprovedCampaigns() {
        return ResponseEntity.ok(campaignService.getAllApprovedCampaigns());
    }

    @GetMapping("/campaign/{id}")
    public ResponseEntity<Campaign> getCampaignById(@PathVariable Long id) {
        return campaignService.getCampaignById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PatchMapping("/campaign/{id}/status")
    public ResponseEntity<Campaign> updateCampaignStatus(@PathVariable Long id, @RequestParam Campaign.Status status) {
        return ResponseEntity.ok(campaignService.updateCampaignStatus(id, status));
    }

    @GetMapping("/campaign/category")
    public ResponseEntity<List<Campaign>> getCampaignsByCategory(@RequestParam String category) {
        return ResponseEntity.ok(campaignService.getCampaignsByCategory(category));
    }

    @GetMapping("/campaign/sorted")
    public ResponseEntity<List<Campaign>> getSortedCampaigns(@RequestParam String sortBy) {
        CampaignSortStrategy strategy;

        // Choose the strategy based on the request parameter
        switch (sortBy.toLowerCase()) {
            case "date":
                strategy = new SortByDateStrategy();
                break;
            case "goalamount":
                strategy = new SortByGoalAmountStrategy();
                break;
            case "status":
                strategy = new SortByStatusStrategy();
                break;
            case "Emergency" :
                strategy = new SortByDueDateAsc();
            case "Recent" :
                strategy = new SortByCreationDateDesc();

            default:
                return ResponseEntity.badRequest().build();
        }

        // Fetch and return sorted campaigns
        List<Campaign> sortedCampaigns = campaignService.getSortedCampaigns(strategy);
        return ResponseEntity.ok(sortedCampaigns);
    }
}
