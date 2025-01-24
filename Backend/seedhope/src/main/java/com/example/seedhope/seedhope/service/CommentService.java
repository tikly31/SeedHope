package com.example.seedhope.seedhope.service;


import com.example.seedhope.seedhope.model.CommentDTO;
import org.springframework.data.domain.Page;

import java.util.List;
import java.util.UUID;

public interface CommentService {
    CommentDTO createComment(CommentDTO commentDTO);
    List<CommentDTO> getCommentsByCampaignId(Long campaignId);
    Page<CommentDTO> getTopLevelCommentsByCampaignId(Long campaignId, int page, int size);
    List<CommentDTO> getRepliesByParentCommentId(Long parentCommentId);
    CommentDTO addReplyToComment(Long parentCommentId, CommentDTO replyDTO);


    List<CommentDTO> getRepliesForComment(Long parentCommentId);


}