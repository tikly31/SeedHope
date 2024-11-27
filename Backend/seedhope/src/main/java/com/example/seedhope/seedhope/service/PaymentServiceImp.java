package com.example.seedhope.seedhope.service;


import com.example.seedhope.seedhope.model.User;
import com.example.seedhope.seedhope.response.PaymentResponse;
import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.checkout.Session;
import com.stripe.param.checkout.SessionCreateParams;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;


@Service

public class PaymentServiceImp implements PaymentService {

    @Value("${stripe.secret.key}")
    private String strip_api_key;

    public PaymentResponse createPaymentLink(User user) throws StripeException {
        Stripe.apiKey = strip_api_key;
        SessionCreateParams params = SessionCreateParams.builder()
                .addPaymentMethodType(SessionCreateParams.PaymentMethodType.CARD)
                .setMode(SessionCreateParams.Mode.PAYMENT)
                .setSuccessUrl("http://localhost:8080/users")
                .setCancelUrl("http://localhost:8080/users")
                .addLineItem(
                        SessionCreateParams.LineItem.builder()
                                .setQuantity(1L)
                                .setPriceData(
                                        SessionCreateParams.LineItem.PriceData.builder()
                                                .setCurrency("usd")
                                                .setUnitAmount(1000L) // add the amount here
                                                .setProductData(
                                                        SessionCreateParams.LineItem.PriceData.ProductData.builder()
                                                                .setName("donation")
                                                                .build()
                                                )
                                                .build()
                                )
                                .build()
                )
                .build();


        Session session = Session.create(params);
        PaymentResponse paymentResponse = new PaymentResponse();
        paymentResponse.setPayment_url(session.getUrl());
        return paymentResponse;
    }
}
