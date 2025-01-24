package com.example.seedhope.seedhope.controller;

import com.example.seedhope.seedhope.model.CommentDTO;
import com.example.seedhope.seedhope.service.CommentService;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/comments")
public class CommentController {
    private final CommentService commentService;

    public CommentController(CommentService commentService) {
        this.commentService = commentService;
    }

    @PostMapping
    public ResponseEntity<CommentDTO> createComment(@RequestBody CommentDTO commentDTO) {
        CommentDTO createdComment = commentService.createComment(commentDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdComment);
    }

    @GetMapping("/campaign/{campaignId}")
    public ResponseEntity<List<CommentDTO>> getCommentsByCampaignId(@PathVariable Long campaignId) {
        List<CommentDTO> comments = commentService.getCommentsByCampaignId(campaignId);
        return ResponseEntity.ok(comments);
    }

    @GetMapping("/campaign/{campaignId}/paginated")
    public ResponseEntity<Page<CommentDTO>> getTopLevelCommentsByCampaignId(
            @PathVariable Long campaignId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Page<CommentDTO> commentPage = commentService.getTopLevelCommentsByCampaignId(campaignId, page, size);
        return ResponseEntity.ok(commentPage);
    }

    @PostMapping("/add/{parentCommentId}/replies")
    public ResponseEntity<CommentDTO> addReplyToComment(
            @PathVariable Long parentCommentId,
            @RequestBody CommentDTO replyDTO
    ) {
        CommentDTO addedReply = commentService.addReplyToComment(parentCommentId, replyDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(addedReply);
    }

    @GetMapping("/{parentCommentId}/replies")
    public ResponseEntity<List<CommentDTO>> getRepliesForComment(
            @PathVariable Long parentCommentId
    ) {
        List<CommentDTO> replies = commentService.getRepliesForComment(parentCommentId);
        return ResponseEntity.ok(replies);
    }
}
