package com.example.seedhope.seedhope.model;

import com.example.seedhope.seedhope.observer.PaymentObserver;
import jakarta.persistence.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "campaign")
public class Campaign implements PaymentObserver {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long organizer_id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false, length = 1000)
    private String description;

    @Column(nullable = false)
    private String category;

    @Column(nullable = false)
    private Double goalAmount;

    @Column
    private Double raisedAmount = 0.0;

    @Column
    @Enumerated(EnumType.STRING)
    private Status status = Status.PENDING;

    @Column
    private LocalDateTime creationDate = LocalDateTime.now();

    @Column
    private LocalDate dueDate;

    @Column
    private String photoUrl; // New field to store the URL or path of the photo

    // Enum for campaign status
    public enum Status {
        PENDING,
        APPROVED,
        REJECTED,
        DONE
    }

    // Default Constructor
    public Campaign() {}

    // Parameterized Constructor
    public Campaign(String title, String description, String category, Double goalAmount, Status status, LocalDate dueDate, String photoUrl) {
        this.title = title;
        this.description = description;
        this.category = category;
        this.goalAmount = goalAmount;
        this.status = status;
        this.dueDate = dueDate;
        this.photoUrl = photoUrl;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public Long getOrganizerId(){
        return this.organizer_id;
    }

    public void setOrganizerId(Long id){
        this.organizer_id = id;
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

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public Double getGoalAmount() {
        return goalAmount;
    }

    public void setGoalAmount(Double goalAmount) {
        this.goalAmount = goalAmount;
    }

    public Double getRaisedAmount() {
        return raisedAmount;
    }

    public void setRaisedAmount(Double raisedAmount) {
        this.raisedAmount = raisedAmount;
    }

    public Status getStatus() {
        return status;
    }

    public void setStatus(Status status) {
        this.status = status;
    }

    public LocalDateTime getCreationDate() {
        return creationDate;
    }

    public void setCreationDate(LocalDateTime creationDate) {
        this.creationDate = creationDate;
    }

    public LocalDate getDueDate() {
        return dueDate;
    }

    public void setDueDate(LocalDate dueDate) {
        this.dueDate = dueDate;
    }

    public String getPhotoUrl() {
        return photoUrl;
    }

    public void setPhotoUrl(String photoUrl) {
        this.photoUrl = photoUrl;
    }

    // Observer method to update the raised amount
    @Override
    public void update(Payment payment) {
        this.raisedAmount += payment.getAmount();
    }
}
