package com.example.seedhope.seedhope.service;

import com.example.seedhope.seedhope.model.Donation;
import com.example.seedhope.seedhope.repository.DonationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DonationService {

    @Autowired
    private DonationRepository donationRepository;


    public void addDonation(Donation donation) {
        System.out.println("DonationService.addDonation");
        donationRepository.save(donation);
    }

    public List<Donation> getAllDonations() {
        return donationRepository.findAll();
    }

    public List<Donation> getDonationsByCampaignId(Long campaignId) {
        return donationRepository.findByCampaignId(campaignId);
    }

    public Donation getDonationById(Long donationId) {
        return donationRepository.findById(donationId).orElse(null);
    }

    public List<Donation> getDonationsByUserId(Long userId) {
        return donationRepository.findByUserId(userId);
    }
}
