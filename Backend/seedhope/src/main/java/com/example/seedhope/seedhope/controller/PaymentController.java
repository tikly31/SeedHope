package com.example.seedhope.seedhope.controller;


import com.example.seedhope.seedhope.exception.PaymentException;
import com.example.seedhope.seedhope.model.PaymentRequest;
import com.example.seedhope.seedhope.model.PaymentStatus;
import com.example.seedhope.seedhope.response.PaymentResponse;
import com.example.seedhope.seedhope.service.PaymentService;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/payment")
@Slf4j
public class PaymentController {

    private final PaymentService paymentService;

    @Autowired
    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    @PostMapping("/initiate")
    public ResponseEntity<PaymentResponse> initiatePayment(@Valid @RequestBody PaymentRequest paymentRequest) {
        try {
            PaymentResponse response = paymentService.initiatePayment(paymentRequest);
            return ResponseEntity.ok(response);
        } catch (PaymentException e) {
            log.error("Payment initiation failed", e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new PaymentResponse("ERROR", null, e.getMessage(), null));
        }
    }

    @PostMapping("/ipn")
    public ResponseEntity<PaymentStatus> handleIPN(@RequestParam Map<String, String> sslCommerzResponse) {
        try {
            PaymentStatus status = paymentService.validatePayment(sslCommerzResponse);
            return ResponseEntity.ok(status);
        } catch (PaymentException e) {
            log.error("IPN handling failed", e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    @GetMapping("/status/{transactionId}")
    public ResponseEntity<PaymentStatus> getPaymentStatus(@PathVariable String transactionId) {
        try {
            PaymentStatus status = paymentService.getPaymentStatus(transactionId);
            return ResponseEntity.ok(status);
        } catch (PaymentException e) {
            log.error("Payment status check failed", e);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }
}