package com.example.seedhope.seedhope.service;

import com.example.seedhope.seedhope.Factory.CampaignFactory;
import com.example.seedhope.seedhope.dto.CampaignRequestDTO;
import com.example.seedhope.seedhope.model.Campaign;
import com.example.seedhope.seedhope.repository.CampaignRepository;
import com.example.seedhope.seedhope.service.strategy.sorting.CampaignSortStrategy;
import com.example.seedhope.seedhope.util.CampaignSorter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CampaignService {

    @Autowired
    private final CampaignRepository campaignRepository;

    @Autowired
    private CampaignSorter campaignSorter;

    public CampaignService(CampaignRepository campaignRepository) {
        this.campaignRepository = campaignRepository;
    }

    public Campaign createCampaign(String title, String description, String category, Double goalAmount) {
        Campaign campaign = CampaignFactory.createDefaultCampaign(title, description, category, goalAmount);
        return campaignRepository.save(campaign);
    }

    public Campaign requestFundraising(CampaignRequestDTO campaignRequestDTO, Long userId) {
        Campaign campaign = CampaignFactory.createDefaultCampaign(
                campaignRequestDTO.getTitle(),
                campaignRequestDTO.getDescription(),
                campaignRequestDTO.getCategory(),
                campaignRequestDTO.getGoalAmount()
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
}
