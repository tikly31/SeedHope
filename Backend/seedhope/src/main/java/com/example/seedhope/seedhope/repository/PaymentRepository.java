package com.example.seedhope.seedhope.repository;

import com.example.seedhope.seedhope.model.Payment;
import com.example.seedhope.seedhope.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {

    // Optional: Custom query methods (if necessary)

    // Find payments by Campaign ID
    List<Payment> findByCampaignId(Long campaignId);

    // Find payment by User ID (if the Payment class has a user field)
    List<Payment> findByUserId(User userId);

    // Find payment by payment method (e.g., Stripe, PayPal)
    List<Payment> findByPaymentMethod(String paymentMethod);

    // Find a single payment by ID
    Optional<Payment> findById(Long id);
}
