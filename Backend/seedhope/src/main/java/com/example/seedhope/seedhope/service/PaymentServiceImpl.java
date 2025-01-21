
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

    @Value("${api_base_url_android}")
    private String api_base_url_android;

    private final PaymentRepository paymentRepository;
    private final RestTemplate restTemplate;
    @Autowired
    private CampaignService campaignService;

    @Autowired
    public PaymentServiceImpl(PaymentRepository paymentRepository, RestTemplate restTemplate) {
        this.paymentRepository = paymentRepository;
        this.restTemplate = restTemplate;
    }

    @Override
    public PaymentResponse initiatePayment(PaymentRequest paymentRequest) {
        try {
            // push into the database
            System.out.println(paymentRequest);

            // Prepare the request payload
            MultiValueMap<String, String> postData = new LinkedMultiValueMap<>();
            postData.add("store_id", storeId);
            postData.add("store_passwd", storePassword);
            postData.add("total_amount", String.valueOf(paymentRequest.getAmount()));
            postData.add("currency", "BDT");
            postData.add("tran_id", paymentRequest.getTrancationId());
            postData.add("success_url", api_base_url_android+"/api/payment/success/" + paymentRequest.getTrancationId());
            postData.add("fail_url", api_base_url_android +"/api/payment/fail/" + paymentRequest.getTrancationId());
            postData.add("cancel_url",  api_base_url_android +"/api/payment/cancel/" + paymentRequest.getTrancationId());
            postData.add("cus_name", paymentRequest.getName());
            postData.add("cus_email", paymentRequest.getEmail());
            postData.add("cus_phone", paymentRequest.getPhone());
            postData.add("product_profile", paymentRequest.getCampaignId());

            // Set headers
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

            HttpEntity<MultiValueMap<String, String>> requestEntity = new HttpEntity<>(postData, headers);

            // Make the API call
            ResponseEntity<String> response = restTemplate.exchange(
                    sslCommerzApiUrl,
                    HttpMethod.POST,
                    requestEntity,
                    String.class
            );

            // Parse the response
            ObjectMapper mapper = new ObjectMapper();
            JsonNode rootNode = mapper.readTree(response.getBody());

            if (rootNode.has("status") && "SUCCESS".equalsIgnoreCase(rootNode.get("status").asText())) {
                // Save initial payment status
                saveInitialPaymentStatus(paymentRequest);

                return new PaymentResponse(
                        "SUCCESS",
                        rootNode.get("GatewayPageURL").asText(),
                        "Payment initiation successful",
                        paymentRequest.getTrancationId()
                );
            } else {
                log.error("Payment API returned an error: {}", response.getBody());
                throw new PaymentException("Payment initiation failed: " + rootNode.get("failedreason").asText());
            }

        } catch (Exception e) {
            log.error("Payment initiation failed", e);
            throw new PaymentException("Payment initiation failed: " + e.getMessage());
        }
    }

    private void saveInitialPaymentStatus(PaymentRequest paymentRequest) {
        PaymentStatus paymentStatus = new PaymentStatus();
        paymentStatus.setTransactionId(paymentRequest.getTrancationId());
        paymentStatus.setAmount(paymentRequest.getAmount());
        paymentStatus.setStatus("INITIATED");
        paymentStatus.setCreatedAt(LocalDateTime.now());
        paymentStatus.setUpdatedAt(LocalDateTime.now());
        paymentStatus.setCustomerInfo(paymentRequest.getName());
        paymentStatus.setCampaignId(paymentRequest.getCampaignId());
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
    public PaymentStatus updateStatus(String transactionId, String status) {
        PaymentStatus paymentStatus = paymentRepository.findByTransactionId(transactionId)
                .orElseThrow(() -> new PaymentException("Transaction not found"));
        paymentStatus.setStatus(status);
        paymentStatus.setUpdatedAt(LocalDateTime.now());
        if(status.equals("SUCCESS"))
                campaignService.updateRaisedAmount(Long.parseLong(paymentStatus.getCampaignId()), paymentStatus.getAmount());
        return paymentRepository.save(paymentStatus);
    }

    @Override
    public PaymentStatus getPaymentStatus(String transactionId) {
        return paymentRepository.findByTransactionId(transactionId)
                .orElseThrow(() -> new PaymentException("Transaction not found"));
    }
}
