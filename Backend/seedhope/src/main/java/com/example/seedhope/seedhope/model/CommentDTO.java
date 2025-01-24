package com.example.seedhope.seedhope.model;


import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public class CommentDTO {
    private Long id;
    private Long campaignId;
    private Long userId;
    private String content;
    private LocalDateTime createdAt;

    // New fields for reply support
    private Long parentCommentId;
    private List<CommentDTO> replies;

    // Constructors, getters, and setters


    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getCampaignId() {
        return campaignId;
    }

    public void setCampaignId(Long campaignId) {
        this.campaignId = campaignId;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public Long getParentCommentId() {
        return parentCommentId;
    }

    public void setParentCommentId(Long parentCommentId) {
        this.parentCommentId = parentCommentId;
    }

    public List<CommentDTO> getReplies() {
        return replies;
    }

    public void setReplies(List<CommentDTO> replies) {
        this.replies = replies;
    }

    @Override

    public String toString() {
        return "CommentDTO{" +
                "id=" + id +
                ", campaignId=" + campaignId +
                ", userId=" + userId +
                ", content='" + content + '\'' +
                ", createdAt=" + createdAt +
                ", parentCommentId=" + parentCommentId +
                ", replies=" + replies +
                '}';
    }
}