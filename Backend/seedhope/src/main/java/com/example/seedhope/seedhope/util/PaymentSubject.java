package com.example.seedhope.seedhope.util;

import com.example.seedhope.seedhope.model.Campaign;
import com.example.seedhope.seedhope.model.Payment;
import com.example.seedhope.seedhope.model.User;
import com.example.seedhope.seedhope.service.CampaignService;
import com.example.seedhope.seedhope.service.Userservice;

import java.util.ArrayList;
import java.util.List;

public class PaymentSubject {

    private List<CampaignService> observers = new ArrayList<>();
    private List<Userservice> userobservers = new ArrayList<>();

    // Attach an observer (Campaign)
    public void attach_campaign(CampaignService campaign) {
        observers.add(campaign);
    }

    public void attach_user(Userservice user){ userobservers.add(user); }
    // Detach an observer
    public void detach_campaign(CampaignService campaign) {
        observers.remove(campaign);
    }

    public void detach_user(Userservice user){ userobservers.add(user);}

    // Notify all observers about the payment
    public void notifyObservers(Payment payment) {
        for (CampaignService campaign : observers) {
            campaign.update(payment);
        }
        for(Userservice user : userobservers) {
            user.update(payment);
        }
    }
}
