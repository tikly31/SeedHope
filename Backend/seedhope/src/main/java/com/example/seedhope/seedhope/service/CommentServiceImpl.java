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

import java.time.LocalDateTime;
import java.time.Duration;
import java.util.List;
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
        validateComment(commentDTO);

        Comment comment = modelMapper.map(commentDTO, Comment.class);

        if (comment.getCreatedAt() == null) {
            comment.setCreatedAt(LocalDateTime.now());
        }

        Comment savedComment = commentRepository.save(comment);

        CommentDTO savedCommentDTO = modelMapper.map(savedComment, CommentDTO.class);
        savedCommentDTO.setTimestamp(calculateTimestamp(savedComment.getCreatedAt()));

        return savedCommentDTO;
    }

    @Override
    @Transactional
    public CommentDTO addReplyToComment(Long parentCommentId, CommentDTO replyDTO) {
        Comment parentComment = commentRepository.findById(parentCommentId)
                .orElseThrow(() -> new CommentNotFoundException("Parent comment not found"));

        Comment reply = modelMapper.map(replyDTO, Comment.class);
        reply.setParentComment(parentComment);
        reply.setCreatedAt(LocalDateTime.now());

        Comment savedReply = commentRepository.save(reply);

        CommentDTO savedReplyDTO = modelMapper.map(savedReply, CommentDTO.class);
        savedReplyDTO.setTimestamp(calculateTimestamp(savedReply.getCreatedAt()));

        return savedReplyDTO;
    }

    @Override
    public List<CommentDTO> getCommentsByCampaignId(Long campaignId) {
        List<Comment> comments = commentRepository.findByCampaignIdAndParentCommentIsNullOrderByCreatedAtDesc(campaignId);
        return comments.stream()
                .map(comment -> {
                    CommentDTO commentDTO = modelMapper.map(comment, CommentDTO.class);
                    commentDTO.setTimestamp(calculateTimestamp(comment.getCreatedAt()));

                    List<Comment> replies = commentRepository.findByParentCommentIdOrderByCreatedAtDesc(comment.getId());
                    commentDTO.setReplies(
                            replies.stream()
                                    .map(reply -> {
                                        CommentDTO replyDTO = modelMapper.map(reply, CommentDTO.class);
                                        replyDTO.setTimestamp(calculateTimestamp(reply.getCreatedAt()));
                                        return replyDTO;
                                    })
                                    .collect(Collectors.toList())
                    );

                    return commentDTO;
                })
                .collect(Collectors.toList());
    }

    @Override
    public Page<CommentDTO> getTopLevelCommentsByCampaignId(Long campaignId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());

        Page<Comment> commentPage = commentRepository.findTopLevelCommentsByCampaignId(campaignId, pageable);

        return commentPage.map(comment -> {
            CommentDTO commentDTO = modelMapper.map(comment, CommentDTO.class);
            commentDTO.setTimestamp(calculateTimestamp(comment.getCreatedAt()));
            return commentDTO;
        });
    }

    @Override
    public List<CommentDTO> getRepliesByParentCommentId(Long parentCommentId) {
        List<Comment> replies = commentRepository.findByParentCommentIdOrderByCreatedAtDesc(parentCommentId);
        return replies.stream()
                .map(reply -> {
                    CommentDTO replyDTO = modelMapper.map(reply, CommentDTO.class);
                    replyDTO.setTimestamp(calculateTimestamp(reply.getCreatedAt()));
                    return replyDTO;
                })
                .collect(Collectors.toList());
    }

    @Override
    public List<CommentDTO> getRepliesForComment(Long parentCommentId) {
        return getRepliesByParentCommentId(parentCommentId);
    }

    private void validateComment(CommentDTO commentDTO) {
        if (commentDTO.getContent() == null || commentDTO.getContent().trim().isEmpty()) {
            throw new ValidationException("Comment content cannot be empty");
        }

        if (commentDTO.getContent().length() > 500) {
            throw new ValidationException("Comment too long. Max 500 characters.");
        }
    }

    private String calculateTimestamp(LocalDateTime dateTime) {
        if (dateTime == null) return "";

        LocalDateTime now = LocalDateTime.now();
        Duration duration = Duration.between(dateTime, now);

        long seconds = duration.getSeconds();
        if (seconds < 60) return "Just now";
        if (seconds < 3600) return (seconds / 60) + "m";
        if (seconds < 86400) return (seconds / 3600) + "h";
        if (seconds < 604800) return (seconds / 86400) + "d";
        return (seconds / 604800) + "w";
    }
}