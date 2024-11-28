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

//    // Add method to update the raisedAmount
//    public void addPayment(Double amount, String paymentMethod, LocalDateTime paymentDate) {
//        // Create Payment using builder pattern
//        Payment payment = new Payment.Builder()
//                .setAmount(amount)
//                .setPaymentMethod(paymentMethod)
//                .setPaymentDate(paymentDate)
//                .setCampaign(this) // Associate with the current campaign
//                .build();
//
//        // Add the payment to the campaign's list
//        this.payments.add(payment);
//
//        // Update the raised amount
//        this.raisedAmount += payment.getAmount();
//    }
//
//    public void removePayment(Payment payment) {
//        this.payments.remove(payment);
//        payment.setCampaign(null);  // Disassociate the payment from the campaign
//        this.raisedAmount -= payment.getAmount(); // Adjust the raised amount
//    }



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
