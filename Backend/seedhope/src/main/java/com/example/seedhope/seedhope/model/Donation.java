package com.example.seedhope.seedhope.model;

public class Donation {

    private Long id;
    private String title;
    private double amount;
    private String imageUrl;


    public Donation() {
    }

    public Donation(Long id, String title, double amount, String imageUrl) {
        this.id = id;
        this.title = title;
        this.amount = amount;
        this.imageUrl = imageUrl;
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


    public double getAmount() {
        return amount;
    }

    public void setAmount(double amount) {
        this.amount = amount;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public String toString() {
        return "Donation{id=" + id + ", title='" + title + '\'' + ", amount=" + amount + ", imageUrl='" + imageUrl + '\'' + '}';
    }
}
