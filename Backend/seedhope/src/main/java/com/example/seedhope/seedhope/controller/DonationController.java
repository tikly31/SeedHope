package com.example.seedhope.seedhope.controller;

import com.example.seedhope.seedhope.model.Donation;
import com.example.seedhope.seedhope.service.DonationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController

@RequestMapping("/api/donation")
public class DonationController {


    private final DonationService donationService;

    @Autowired
    public DonationController(DonationService donationService) {
        this.donationService = donationService;
    }

    @GetMapping("/all")
    public List<Donation> getAllDonations() {
        return donationService.getAllDonations();
    }

    @GetMapping("/me/{userId}")
    public List<Donation> getDonationsByUserId(Long userId) {
        return donationService.getDonationsByUserId(userId);
    }
}
