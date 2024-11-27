package com.example.seedhope.seedhope.controller;




import com.example.seedhope.seedhope.model.User;
import com.example.seedhope.seedhope.response.PaymentResponse;
import com.example.seedhope.seedhope.service.PaymentService;
import com.example.seedhope.seedhope.service.PaymentServiceImp;
import com.example.seedhope.seedhope.service.Userservice;
import com.stripe.exception.StripeException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RequestMapping("/api")
@RestController
public class PaymentController {

    @Autowired
    private PaymentService paymentService;
    @Autowired
    private Userservice userservice;



    @PostMapping("/payment/{id}")
    public ResponseEntity<PaymentResponse> createPaymentLink(@PathVariable Long id) throws StripeException {

        User currentUser = userservice.getUserById(id);
        PaymentResponse paymentResponse = paymentService.createPaymentLink(currentUser);
        return ResponseEntity.ok(paymentResponse);
    }



}
