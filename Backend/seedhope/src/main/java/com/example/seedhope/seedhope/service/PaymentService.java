package com.example.seedhope.seedhope.service;

import com.example.seedhope.seedhope.model.PaymentRequest;
import com.example.seedhope.seedhope.model.PaymentStatus;
import com.example.seedhope.seedhope.response.PaymentResponse;

import java.util.Map;
import java.util.Optional;
import java.util.List;


public interface PaymentService {
    PaymentResponse initiatePayment(PaymentRequest paymentRequest);
    PaymentStatus validatePayment(Map<String, String> sslCommerzResponse);
    PaymentStatus updateStatus(String transactionId, String status);
    PaymentStatus getPaymentStatus(String transactionId);

//    List<PaymentStatus> getPaymentStatusesByCustomerInfo(String email);
}
