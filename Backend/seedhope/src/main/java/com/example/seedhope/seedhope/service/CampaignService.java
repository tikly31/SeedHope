package com.example.seedhope.seedhope.service;

import com.example.seedhope.seedhope.Factory.CampaignFactory;
import com.example.seedhope.seedhope.dto.CampaignRequestDTO;
import com.example.seedhope.seedhope.model.Campaign;
import com.example.seedhope.seedhope.model.Payment;
import com.example.seedhope.seedhope.repository.CampaignRepository;
import com.example.seedhope.seedhope.service.strategy.sorting.CampaignSortStrategy;
import com.example.seedhope.seedhope.util.CampaignSorter;
import jakarta.persistence.CascadeType;
import jakarta.persistence.OneToMany;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class CampaignService {

    @Autowired
    private final CampaignRepository campaignRepository;

    @Autowired
    private CampaignSorter campaignSorter;

    @OneToMany(mappedBy = "campaign", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Payment> payments = new ArrayList<>();

    public CampaignService(CampaignRepository campaignRepository) {
        this.campaignRepository = campaignRepository;
    }

    public Campaign createCampaign(String title, Long organizerId, String description, String category, Double goalAmount, LocalDate DueDate, String photourl) {
        Campaign campaign = CampaignFactory.createDefaultCampaign(title, organizerId, description, category, goalAmount, DueDate, photourl);
        return campaignRepository.save(campaign);
    }

    public Campaign addCampaign(@RequestBody Campaign campaign) {
        System.out.println(campaign);
        return campaignRepository.save(campaign);
    }

    public Campaign requestFundraising(CampaignRequestDTO campaignRequestDTO, Long userId) {
        Campaign campaign = CampaignFactory.createDefaultCampaign(
                campaignRequestDTO.getTitle(),
                userId,
                campaignRequestDTO.getDescription(),
                campaignRequestDTO.getCategory(),
                campaignRequestDTO.getGoalAmount(),
                campaignRequestDTO.getDueDate(),
                campaignRequestDTO.getPhotourl()
        );
        campaign.setId(userId);
        return campaignRepository.save(campaign);
    }

    public List<Campaign> getAllApprovedCampaigns() {
        return campaignRepository.findByStatus(Campaign.Status.APPROVED);
    }

    public Optional<Campaign> getCampaignById(Long id) {
        return campaignRepository.findById(id);
    }

    public Campaign updateCampaignStatus(Long id, Campaign.Status status) {
        Campaign campaign = campaignRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Campaign not found"));
        campaign.setStatus(status);
        return campaignRepository.save(campaign);
    }

    public List<Campaign> getCampaignsByCategory(String category) {
        return campaignRepository.findByCategoryAndStatus(category, Campaign.Status.APPROVED);
    }

    public List<Campaign> getSortedCampaigns(CampaignSortStrategy strategy) {
        List<Campaign> campaigns = campaignRepository.findAll();

        // Set the sorting strategy dynamically
        campaignSorter.setSortStrategy(strategy);

        // Return the sorted campaigns
        return campaignSorter.sortCampaigns(campaigns);
    }

    public List<Campaign> getSuccessfulCampaigns() {
        return campaignRepository.findByStatus(Campaign.Status.DONE);
    }

    // Update campaign
    public Campaign updateRaisedAmount(Long campaignId, Double amount) {
        Campaign campaign = campaignRepository.findById(campaignId)
                .orElseThrow(() -> new IllegalArgumentException("Campaign not found"));

        if (campaign.getRaisedAmount() + amount > campaign.getGoalAmount()) {
            throw new IllegalArgumentException("Raised amount cannot exceed goal amount");
        }

        // Update the raised amount
        campaign.setRaisedAmount(campaign.getRaisedAmount() + amount);

        // Check if the goal amount is reached and update status to DONE
        if (campaign.getRaisedAmount() >= campaign.getGoalAmount()) {
            campaign.setStatus(Campaign.Status.DONE);
        }

        return campaignRepository.save(campaign);
    }
}
