package com.example.seedhope.seedhope.repository;

import com.example.seedhope.seedhope.model.PaymentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


import java.util.Optional;


@Repository
public interface PaymentRepository extends JpaRepository<PaymentStatus, String> {
    Optional<PaymentStatus> findByTransactionId(String transactionId);
}