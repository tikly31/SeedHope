package com.example.seedhope.seedhope.service;

import com.example.seedhope.seedhope.exception.CommentNotFoundException;
import com.example.seedhope.seedhope.exception.ValidationException;
import com.example.seedhope.seedhope.model.Comment;
import com.example.seedhope.seedhope.model.CommentDTO;
import com.example.seedhope.seedhope.repository.CommentRepository;

import org.modelmapper.ModelMapper;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class CommentServiceImpl implements CommentService {
    private final CommentRepository commentRepository;
    private final ModelMapper modelMapper;

    public CommentServiceImpl(CommentRepository commentRepository, ModelMapper modelMapper) {
        this.commentRepository = commentRepository;
        this.modelMapper = modelMapper;
    }

    @Override
    @Transactional
    public CommentDTO createComment(CommentDTO commentDTO) {

        System.out.println("CommentServiceImpl.createComment");
        System.out.println("commentDTO: " + commentDTO.toString());
        // Validate input
        validateComment(commentDTO);

        // Convert DTO to Entity
        Comment comment = modelMapper.map(commentDTO, Comment.class);

        // Save comment
        Comment savedComment = commentRepository.save(comment);

        // Convert back to DTO
        return modelMapper.map(savedComment, CommentDTO.class);
    }


    @Transactional
    public CommentDTO addReplyToComment(Long parentCommentId, CommentDTO replyDTO) {
        // Find parent comment
        Comment parentComment = commentRepository.findById(parentCommentId)
                .orElseThrow(() -> new CommentNotFoundException("Parent comment not found"));

        // Convert DTO to Entity
        Comment reply = modelMapper.map(replyDTO, Comment.class);

        // Set parent comment
        reply.setParentComment(parentComment);

        // Save reply
        Comment savedReply = commentRepository.save(reply);

        // Convert back to DTO
        return modelMapper.map(savedReply, CommentDTO.class);
    }

    public List<CommentDTO> getRepliesForComment(Long parentCommentId) {
        List<Comment> replies = commentRepository.findByParentCommentIdOrderByCreatedAtDesc(parentCommentId);
        return replies.stream()
                .map(reply -> modelMapper.map(reply, CommentDTO.class))
                .collect(Collectors.toList());
    }

    @Override
    public List<CommentDTO> getCommentsByCampaignId(Long campaignId) {
        List<Comment> comments = commentRepository.findByCampaignIdOrderByCreatedAtDesc(campaignId);
        return comments.stream()
                .map(comment -> modelMapper.map(comment, CommentDTO.class))
                .collect(Collectors.toList());
    }

    @Override
    public Page<CommentDTO> getTopLevelCommentsByCampaignId(Long campaignId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());

        Page<Comment> commentPage = commentRepository.findTopLevelCommentsByCampaignId(campaignId, pageable);

        return commentPage.map(comment -> modelMapper.map(comment, CommentDTO.class));
    }

    @Override
    public List<CommentDTO> getRepliesByParentCommentId(Long parentCommentId) {
        List<Comment> replies = commentRepository.findByParentCommentIdOrderByCreatedAtDesc(parentCommentId);
        return replies.stream()
                .map(reply -> modelMapper.map(reply, CommentDTO.class))
                .collect(Collectors.toList());
    }



    private void validateComment(CommentDTO commentDTO) {
        if (commentDTO.getContent() == null || commentDTO.getContent().trim().isEmpty()) {
            throw new ValidationException("Comment content cannot be empty");
        }

        if (commentDTO.getContent().length() > 500) {
            throw new ValidationException("Comment too long. Max 500 characters.");
        }
    }
}