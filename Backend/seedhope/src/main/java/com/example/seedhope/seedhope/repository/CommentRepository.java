package com.example.seedhope.seedhope.repository;

import com.example.seedhope.seedhope.model.Comment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Long> {
    // Find comments by campaign ID
    List<Comment> findByCampaignIdOrderByCreatedAtDesc(Long campaignId);

    // Paginated comments by campaign ID
    @Query("SELECT c FROM Comment c WHERE c.campaignId = :campaignId AND c.parentComment IS NULL")
    Page<Comment> findTopLevelCommentsByCampaignId(
            @Param("campaignId") Long campaignId,
            Pageable pageable
    );

    // Find replies for a specific comment
    List<Comment> findByParentCommentIdOrderByCreatedAtDesc(Long parentCommentId);
}