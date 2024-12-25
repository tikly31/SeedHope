package com.example.seedhope.seedhope.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private Double amount;

    @Column(nullable = false)
    private String paymentMethod; // e.g., Stripe, PayPal

    @Column(nullable = false)
    private LocalDateTime paymentDate;

    @ManyToOne
    @JoinColumn(name = "campaign_id", nullable = false)
    private Campaign campaign;

    // Private constructor to prevent direct instantiation
    private Payment(Builder builder) {
        this.user = builder.user;
        this.amount = builder.amount;
        this.paymentMethod = builder.paymentMethod;
        this.paymentDate = builder.paymentDate;
        this.campaign = builder.campaign;
    }

    // Getters and Setters (optional if using Builder pattern)
    public Long getId() {
        return id;
    }

    public User getUser() {
        return user;
    }

    public Double getAmount() {
        return amount;
    }

    public String getPaymentMethod() {
        return paymentMethod;
    }

    public LocalDateTime getPaymentDate() {
        return paymentDate;
    }

    public Campaign getCampaign() {
        return campaign;
    }

    @Override
    public String toString() {
        return "Payment{" +
                "id=" + id +
                ", amount=" + amount +
                ", paymentMethod='" + paymentMethod + '\'' +
                ", paymentDate=" + paymentDate +
                ", campaign=" + campaign.getTitle() + // Get the campaign title for better readability
                '}';
    }

    // Static Builder class
    public static class Builder {

        private User user;
        private Double amount;
        private String paymentMethod;
        private LocalDateTime paymentDate;
        private Campaign campaign;

        // Setters for Builder pattern (return the builder instance)
        public Builder setUser(User user){
            this.user = user;
            return this;
        }

        public Builder setAmount(Double amount) {
            this.amount = amount;
            return this;
        }

        public Builder setPaymentMethod(String paymentMethod) {
            this.paymentMethod = paymentMethod;
            return this;
        }

        public Builder setPaymentDate(LocalDateTime paymentDate) {
            this.paymentDate = paymentDate;
            return this;
        }

        public Builder setCampaign(Campaign campaign) {
            this.campaign = campaign;
            return this;
        }

        // Build the Payment object
        public Payment build() {
            return new Payment(this);
        }
    }
}
