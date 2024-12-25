package com.example.seedhope.seedhope.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import org.springframework.cglib.core.Local;

import java.time.LocalDate;

public class CampaignRequestDTO {

    @NotBlank(message = "Title is required")
    private String title;

    @NotBlank(message = "Description is required")
    private String description;

    @NotBlank(message = "Category is required")
    private String category;

    @NotNull(message = "Goal amount is required")
    @Positive(message = "Goal amount must be positive")
    private Double goalAmount;

    @NotNull(message = "Due Date is required")
    private LocalDate due_date;

    @NotNull(message = "Please insert a photo")
    private String photourl;

    // Getters and Setters


    public String getPhotourl() {
        return photourl;
    }

    public void setPhotourl(String photourl){
        this.photourl = photourl;
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

    public LocalDate getDueDate(){
        return this.due_date;
    }

    public void setDueDate(LocalDate due_date){
        this.due_date = due_date;
    }
}
