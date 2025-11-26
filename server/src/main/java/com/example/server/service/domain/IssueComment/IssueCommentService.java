package com.example.server.service.domain.IssueComment;

import com.example.server.model.entity.IssueComment;

public interface IssueCommentService {
    IssueComment addComment(IssueComment comment, int projectId);
    void deleteComment(IssueComment comment);
}
