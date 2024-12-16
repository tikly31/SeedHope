package com.example.seedhope.seedhope.Factory;

import com.example.seedhope.seedhope.model.Campaign;

import java.time.LocalDate;
import java.time.LocalDateTime;
public class CampaignFactory {
    public static Campaign createDefaultCampaign(String title, Long organizerId, String description, String category, Double goalAmount, LocalDate DueDate, String photourl) {
        Campaign campaign = new Campaign();
        campaign.setTitle(title);
        campaign.setDescription(description);
        campaign.setOrganizerId(organizerId);
        campaign.setCategory(category);
        campaign.setGoalAmount(goalAmount);
        campaign.setStatus(Campaign.Status.PENDING); // Default status
        campaign.setCreationDate(LocalDateTime.now());
        campaign.setDueDate(DueDate);
        campaign.setPhotoUrl(photourl);// Automatically set creation time
        return campaign;
    }

    public static Campaign createApprovedCampaign(String title, Long organizerId, String description, String category, Double goalAmount, LocalDate DueDate, String photourl) {
        Campaign campaign = createDefaultCampaign(title, organizerId, description, category, goalAmount, DueDate, photourl);
        campaign.setStatus(Campaign.Status.APPROVED); // Set status to approved
        return campaign;
    }

    public static Campaign createRejectedCampaign(String title, Long organizerId, String description, String category, Double goalAmount, LocalDate DueDate, String photourl) {
        Campaign campaign = createDefaultCampaign(title, organizerId, description, category, goalAmount, DueDate, photourl);
        campaign.setStatus(Campaign.Status.REJECTED); // Set status to rejected
        return campaign;
    }
}
