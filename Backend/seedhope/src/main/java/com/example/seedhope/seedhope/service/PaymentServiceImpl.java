
package com.example.seedhope.seedhope.service;

import com.example.seedhope.seedhope.exception.PaymentException;
import com.example.seedhope.seedhope.model.PaymentRequest;
import com.example.seedhope.seedhope.model.PaymentStatus;
import com.example.seedhope.seedhope.repository.PaymentRepository;
import com.example.seedhope.seedhope.response.PaymentResponse;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

// PaymentServiceImpl.java (Implementation)
@Service
@Slf4j
public class PaymentServiceImpl implements PaymentService {

    @Value("${sslcommerz.store.id}")
    private String storeId;

    @Value("${sslcommerz.store.password}")
    private String storePassword;

    @Value("${sslcommerz.api.url}")
    private String sslCommerzApiUrl;

    private final PaymentRepository paymentRepository;
    private final RestTemplate restTemplate;

    @Autowired
    public PaymentServiceImpl(PaymentRepository paymentRepository, RestTemplate restTemplate) {
        this.paymentRepository = paymentRepository;
        this.restTemplate = restTemplate;
    }

    @Override
    public PaymentResponse initiatePayment(PaymentRequest paymentRequest) {
        try {
            // Create MultiValueMap instead of HashMap
            MultiValueMap<String, String> postData = new LinkedMultiValueMap<>();

            // Add parameters to MultiValueMap
            postData.add("store_id", storeId);
            postData.add("store_passwd", storePassword);
            postData.add("total_amount", String.valueOf(paymentRequest.getAmount()));
            postData.add("currency", paymentRequest.getCurrency());
            postData.add("tran_id", paymentRequest.getTransactionId());
            postData.add("success_url", "http://localhost:8080/api/payment/success");
            postData.add("fail_url", "http://localhost:8080/api/payment/fail");
            postData.add("cancel_url", "http://localhost:8080/api/payment/cancel");
            postData.add("cus_name", paymentRequest.getCustomerName());
            postData.add("cus_email", paymentRequest.getCustomerEmail());
            postData.add("cus_phone", paymentRequest.getCustomerPhone());
            postData.add("product_info", paymentRequest.getProductInfo());

            // Set headers
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

            // Create request entity
            HttpEntity<MultiValueMap<String, String>> requestEntity =
                    new HttpEntity<>(postData, headers);

            // Make API call
            ResponseEntity<String> response = restTemplate.exchange(
                    sslCommerzApiUrl,
                    HttpMethod.POST,
                    requestEntity,
                    String.class
            );

            // Parse response
            ObjectMapper mapper = new ObjectMapper();
            JsonNode rootNode = mapper.readTree(response.getBody());

            // Save initial payment status
            saveInitialPaymentStatus(paymentRequest);

            return new PaymentResponse(
                    "SUCCESS",
                    rootNode.get("GatewayPageURL").asText(),
                    "Payment initiation successful",
                    paymentRequest.getTransactionId()
            );

        } catch (Exception e) {
            log.error("Payment initiation failed", e);
            throw new PaymentException("Payment initiation failed: " + e.getMessage());
        }
    }

    private void saveInitialPaymentStatus(PaymentRequest paymentRequest) {
        PaymentStatus paymentStatus = new PaymentStatus();
        paymentStatus.setTransactionId(paymentRequest.getTransactionId());
        paymentStatus.setAmount(paymentRequest.getAmount());
        paymentStatus.setStatus("INITIATED");
        paymentStatus.setCreatedAt(LocalDateTime.now());
        paymentStatus.setUpdatedAt(LocalDateTime.now());
        paymentStatus.setCustomerInfo(paymentRequest.getCustomerName());

        paymentRepository.save(paymentStatus);
    }
    @Override
    public PaymentStatus validatePayment(Map<String, String> sslCommerzResponse) {
        String transactionId = sslCommerzResponse.get("tran_id");
        String status = sslCommerzResponse.get("status");

        PaymentStatus paymentStatus = paymentRepository.findByTransactionId(transactionId)
                .orElseThrow(() -> new PaymentException("Transaction not found"));

        paymentStatus.setStatus(status);
        paymentStatus.setUpdatedAt(LocalDateTime.now());
        paymentStatus.setPaymentMethod(sslCommerzResponse.get("card_type"));

        return paymentRepository.save(paymentStatus);
    }

    @Override
    public PaymentStatus getPaymentStatus(String transactionId) {
        return paymentRepository.findByTransactionId(transactionId)
                .orElseThrow(() -> new PaymentException("Transaction not found"));
    }

    private Map<String, String> prepareSSLCommerzRequest(PaymentRequest paymentRequest) {
        Map<String, String> postData = new HashMap<>();
        postData.put("store_id", storeId);
        postData.put("store_passwd", storePassword);
        postData.put("total_amount", String.valueOf(paymentRequest.getAmount()));
        postData.put("currency", paymentRequest.getCurrency());
        postData.put("tran_id", paymentRequest.getTransactionId());
        postData.put("success_url", "your_success_url");
        postData.put("fail_url", "your_fail_url");
        postData.put("cancel_url", "your_cancel_url");
        postData.put("cus_name", paymentRequest.getCustomerName());
        postData.put("cus_email", paymentRequest.getCustomerEmail());
        postData.put("cus_phone", paymentRequest.getCustomerPhone());
        postData.put("product_info", paymentRequest.getProductInfo());

        return postData;
    }


}