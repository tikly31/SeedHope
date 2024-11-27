package com.example.seedhope.seedhope.service;

import com.example.seedhope.seedhope.model.User;
import com.example.seedhope.seedhope.response.PaymentResponse;
import com.stripe.exception.StripeException;


public interface PaymentService {

    public PaymentResponse createPaymentLink(User user) throws StripeException;
}
