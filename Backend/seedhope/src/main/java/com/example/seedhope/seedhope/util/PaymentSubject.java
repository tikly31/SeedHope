package com.example.seedhope.seedhope.util;

import com.example.seedhope.seedhope.model.Campaign;
import com.example.seedhope.seedhope.model.Payment;

import java.util.ArrayList;
import java.util.List;

public class PaymentSubject {

    private List<Campaign> observers = new ArrayList<>();

    // Attach an observer (Campaign)
    public void attach(Campaign campaign) {
        observers.add(campaign);
    }

    // Detach an observer
    public void detach(Campaign campaign) {
        observers.remove(campaign);
    }

    // Notify all observers about the payment
    public void notifyObservers(Payment payment) {
        for (Campaign campaign : observers) {
            campaign.update(payment);
        }
    }
}
