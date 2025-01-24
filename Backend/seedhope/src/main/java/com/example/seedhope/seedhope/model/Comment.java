package com.example.seedhope.seedhope.model;

import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.UUID;

@Entity
@Table(name = "comments")
public class Comment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "campaign_id", nullable = false)
    private Long campaignId;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "content", nullable = false, length = 500)
    private String content;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    // New field for parent comment (reply support)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parent_comment_id")
    private Comment parentComment;

    // One-to-many relationship for replies
    @OneToMany(mappedBy = "parentComment", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Comment> replies = new ArrayList<>();

    // Getters
    public Long getId() {
        return id;
    }

    public Long getCampaignId() {
        return campaignId;
    }

    public Long getUserId() {
        return userId;
    }

    public String getContent() {
        return content;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public Comment getParentComment() {
        return parentComment;
    }

    public List<Comment> getReplies() {
        return replies;
    }

    // Setters
    public void setId(Long id) {
        this.id = id;
    }

    public void setCampaignId(Long campaignId) {
        this.campaignId = campaignId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public void setParentComment(Comment parentComment) {
        this.parentComment = parentComment;
    }

    public void setReplies(List<Comment> replies) {
        this.replies = replies;
    }

    // Nested Builder pattern
    public static class CommentBuilder {
        private Comment comment;

        public CommentBuilder() {
            this.comment = new Comment();
        }

        public CommentBuilder id(Long id) {
            comment.setId(id);
            return this;
        }

        public CommentBuilder campaignId(Long campaignId) {
            comment.setCampaignId(campaignId);
            return this;
        }

        public CommentBuilder userId(Long userId) {
            comment.setUserId(userId);
            return this;
        }

        public CommentBuilder content(String content) {
            comment.setContent(content);
            return this;
        }

        // New method for parent comment
        public CommentBuilder parentComment(Comment parentComment) {
            comment.setParentComment(parentComment);
            return this;
        }

        public Comment build() {
            comment.setCreatedAt(LocalDateTime.now());
            return comment;
        }
    }

    // Additional methods to manage replies
    public void addReply(Comment reply) {
        replies.add(reply);
        reply.setParentComment(this);
    }

    public void removeReply(Comment reply) {
        replies.remove(reply);
        reply.setParentComment(null);
    }

    // Optional: equals and hashCode methods
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Comment comment = (Comment) o;
        return Objects.equals(id, comment.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }
}