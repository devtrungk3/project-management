package com.example.server.controller.user;

import com.example.server.model.entity.Issue;
import com.example.server.model.entity.IssueComment;
import com.example.server.model.entity.User;
import com.example.server.service.domain.IssueComment.IssueCommentService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/user/projects/{projectId}/issues/{issueId}/comment")
@RequiredArgsConstructor
public class IssueCommentController {
    private final IssueCommentService commentService;
    @PostMapping
    public ResponseEntity<IssueComment> addComment(
            @RequestBody IssueComment comment,
            @PathVariable(name = "projectId") int projectId,
            @PathVariable(name = "issueId") int issueId,
            HttpServletRequest request) {
        int userIdExtractedFromJWT = (int) request.getAttribute("userId");
        Issue issue = new Issue();
        issue.setId(issueId);
        User user = new User();
        user.setId(userIdExtractedFromJWT);
        comment.setIssue(issue);
        comment.setAuthor(user);
        return ResponseEntity.status(HttpStatus.CREATED).body(commentService.addComment(comment, projectId));
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<IssueComment> deleteComment(
            @PathVariable(name = "id") int commentId,
            HttpServletRequest request) {
        int userIdExtractedFromJWT = (int) request.getAttribute("userId");
        User user = new User();
        user.setId(userIdExtractedFromJWT);
        IssueComment comment = new IssueComment();
        comment.setId(commentId);
        comment.setAuthor(user);
        commentService.deleteComment(comment);
        return ResponseEntity.noContent().build();
    }
}
