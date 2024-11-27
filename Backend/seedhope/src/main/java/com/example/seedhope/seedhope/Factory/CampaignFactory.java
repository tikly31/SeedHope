package com.example.seedhope.seedhope.Factory;

import com.example.seedhope.seedhope.model.Campaign;

import java.time.LocalDateTime;
public class CampaignFactory {
    public static Campaign createDefaultCampaign(String title, String description, String category, Double goalAmount) {
        Campaign campaign = new Campaign();
        campaign.setTitle(title);
        campaign.setDescription(description);
        campaign.setCategory(category);
        campaign.setGoalAmount(goalAmount);
        campaign.setStatus(Campaign.Status.PENDING); // Default status
        campaign.setCreatedAt(LocalDateTime.now()); // Automatically set creation time
        return campaign;
    }

    public static Campaign createApprovedCampaign(String title, String description, String category, Double goalAmount) {
        Campaign campaign = createDefaultCampaign(title, description, category, goalAmount);
        campaign.setStatus(Campaign.Status.APPROVED); // Set status to approved
        return campaign;
    }

    public static Campaign createRejectedCampaign(String title, String description, String category, Double goalAmount) {
        Campaign campaign = createDefaultCampaign(title, description, category, goalAmount);
        campaign.setStatus(Campaign.Status.REJECTED); // Set status to rejected
        return campaign;
    }
}
