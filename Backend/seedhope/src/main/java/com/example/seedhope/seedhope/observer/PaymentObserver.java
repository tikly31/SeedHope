package com.example.seedhope.seedhope.observer;

import com.example.seedhope.seedhope.model.Payment;

public interface PaymentObserver {
    void update(Payment payment);
}
