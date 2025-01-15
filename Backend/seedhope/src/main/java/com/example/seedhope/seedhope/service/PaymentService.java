package com.example.seedhope.seedhope.service;

import com.example.seedhope.seedhope.model.PaymentRequest;
import com.example.seedhope.seedhope.model.PaymentStatus;
import com.example.seedhope.seedhope.model.User;
import com.example.seedhope.seedhope.response.PaymentResponse;
import com.stripe.exception.StripeException;

import java.util.Map;


public interface PaymentService {
    PaymentResponse initiatePayment(PaymentRequest paymentRequest);
    PaymentStatus validatePayment(Map<String, String> sslCommerzResponse);
    PaymentStatus updateStatus(String transactionId, String status);
    PaymentStatus getPaymentStatus(String transactionId);
}
