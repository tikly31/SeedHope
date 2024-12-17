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
    public Campaign addCampaign(@RequestBody Campaign campaign){
        System.out.println(campaign);
        return campaignService.addCampaign(campaign);
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
            case "emergency" :
                strategy = new SortByDueDateAsc();
                break;
            case "recent" :
                strategy = new SortByCreationDateDesc();
                break;

            default:
                return ResponseEntity.badRequest().build();
        }

        // Fetch and return sorted campaigns
        List<Campaign> sortedCampaigns = campaignService.getSortedCampaigns(strategy);
        return ResponseEntity.ok(sortedCampaigns);
    }

    @GetMapping("/campaign/successful")
    public ResponseEntity<List<Campaign>> getSuccessfulCampaigns(){
        return ResponseEntity.ok(campaignService.getSuccessfulCampaigns());
    }

    @PatchMapping("/campaign/{id}/updateAmount")
    public ResponseEntity<Campaign> updateRaisedAmount(@PathVariable Long id, @RequestParam Double Amount){
        return ResponseEntity.ok(campaignService.updateRaisedAmount(id,Amount));
    }

    @GetMapping("/campaign/{category}/search")
    public ResponseEntity<List<Campaign>> searchCampaigns(
            @PathVariable String category,
            @RequestParam String searchTerm) {
        List<Campaign> campaigns = campaignService.searchCampaigns(category, searchTerm);
        return ResponseEntity.ok(campaigns);
    }
}
