package com.example.seedhope.seedhope.service;

import com.example.seedhope.seedhope.model.CommentDTO;
import org.springframework.data.domain.Page;

import java.util.List;

public interface CommentService {
    CommentDTO createComment(CommentDTO commentDTO);
    List<CommentDTO> getCommentsByCampaignId(Long campaignId);
    Page<CommentDTO> getTopLevelCommentsByCampaignId(Long campaignId, int page, int size);
    CommentDTO addReplyToComment(Long parentCommentId, CommentDTO replyDTO);
    List<CommentDTO> getRepliesByParentCommentId(Long parentCommentId);
    List<CommentDTO> getRepliesForComment(Long parentCommentId);
}