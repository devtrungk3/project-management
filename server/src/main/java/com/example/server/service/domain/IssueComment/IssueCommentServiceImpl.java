package com.example.server.service.domain.IssueComment;

import com.example.server.exception.EntityNotFoundException;
import com.example.server.exception.UserNotInProjectException;
import com.example.server.model.entity.IssueComment;
import com.example.server.repository.IssueCommentRepository;
import com.example.server.repository.ResourceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class IssueCommentServiceImpl implements IssueCommentService{
    private final IssueCommentRepository commentRepository;
    private final ResourceRepository resourceRepository;
    @Override
    public IssueComment addComment(IssueComment comment, int projectId) {
        if (!resourceRepository.existsByProject_IdAndUser_Id(projectId, comment.getAuthor().getId())) {
            throw new UserNotInProjectException("User with ID" + comment.getAuthor().getId() + " is not a member of project with ID " + projectId + ". User must be a member to add issue comment.");
        }
        comment.setId(0);
        return commentRepository.save(comment);
    }

    @Override
    public void deleteComment(IssueComment comment) {
        IssueComment commentInDB = commentRepository.findByIdAndAuthor_Id(comment.getId(), comment.getAuthor().getId()).orElseThrow(() ->
            new EntityNotFoundException("No issue comment found with id " + comment.getId() + " and author id " + comment.getAuthor().getId())
        );
        commentRepository.deleteById(commentInDB.getId());
    }
}
