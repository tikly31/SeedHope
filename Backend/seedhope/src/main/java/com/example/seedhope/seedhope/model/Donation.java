package com.example.seedhope.seedhope.model;


import jakarta.persistence.*;

@Entity
@Table(name = "donations")
public class Donation {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Long userId;
    private Long campaignId;
    private String title;
    private double amount;

    private String status;
    private String imageUrl;


    public Donation() {
    }

    public Donation(Long id, String title, double amount, String imageUrl) {
        this.id = id;
        this.title = title;
        this.amount = amount;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public void setImageUrl(String imageUrl){
        this.imageUrl = imageUrl;
    }
    public String getImageUrl(){
        return this.imageUrl;
    }
    public double getAmount() {
        return amount;
    }

    public void setAmount(double amount) {
        this.amount = amount;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public Long getCampaignId() {
        return campaignId;
    }

    public void setCampaignId(Long campaignId) {
        this.campaignId = campaignId;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    // toString() method

    @Override
    public String toString() {
        return "Donation{" +
                "id=" + id +
                ", userId=" + userId +
                ", campaignId=" + campaignId +
                ", title='" + title + '\'' +
                ", amount=" + amount +
                ", status='" + status + '\'' +
                '}';
    }


}
