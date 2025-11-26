package com.example.server.service.domain.issue;

import com.example.server.exception.EntityNotFoundException;
import com.example.server.exception.UserNotInProjectException;
import com.example.server.model.dto.IssueCommentDTO;
import com.example.server.model.dto.IssueDTO;
import com.example.server.model.dto.IssueDetailDTO;
import com.example.server.model.entity.Issue;
import com.example.server.model.entity.IssueComment;
import com.example.server.model.enums.IssueStatus;
import com.example.server.repository.IssueCommentRepository;
import com.example.server.repository.IssueRepository;
import com.example.server.repository.ResourceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class IssueServiceImpl implements IssueService {
    private final IssueRepository issueRepository;
    private final ResourceRepository resourceRepository;
    private final IssueCommentRepository issueCommentRepository;

    @Override
    public List<IssueDTO> getIssuesByProjectAndUser(int projectId, int userId) {
        if (!resourceRepository.existsByProject_IdAndUser_Id(projectId, userId)) {
            throw new UserNotInProjectException("User with ID" + userId + " is not a member of project with ID " + projectId + ". User must be a member to get issues.");
        }
        return issueRepository.findByProjectId(projectId);
    }

    @Override
    public IssueDetailDTO getIssueById(int issueId, int projectId, int userId) {
        if (!resourceRepository.existsByProject_IdAndUser_Id(projectId, userId)) {
            throw new UserNotInProjectException("User with ID" + userId + " is not a member of project with ID " + projectId + ". User must be a member to get issues.");
        }
        Issue issue = issueRepository.findByIdAndProject_Id(issueId, projectId).orElseThrow(() -> {
            throw new EntityNotFoundException("No issue found with id " + issueId + " and project id " + projectId);
        });
        List<IssueComment> comments = issueCommentRepository.findByIssue_Id(issue.getId());
        return new IssueDetailDTO(
            issue.getId(),
            issue.getTitle(),
            issue.getDescription(),
            issue.getIssueStatus(),
            issue.getAuthor().getUsername(),
            issue.getCreatedAt(),
            comments.stream().map(comment -> new IssueCommentDTO(
                    comment.getId(),
                    comment.getContent(),
                    comment.getAuthor().getUsername(),
                    comment.getCreatedAt()
            )).toList()
        );
    }

    @Override
    public Issue addIssue(Issue issue) {
        if (!resourceRepository.existsByProject_IdAndUser_Id(issue.getProject().getId(), issue.getAuthor().getId())) {
            throw new UserNotInProjectException("User with ID" + issue.getAuthor().getId() + " is not a member of project with ID " + issue.getProject().getId() +". User must be a member to add issue.");
        }
        issue.setId(0);
        issue.setIssueStatus(IssueStatus.OPEN);
        return issueRepository.save(issue);
    }

    @Override
    public Issue changeStatus(Issue updatedIssue, IssueStatus issueStatus) {
        Issue issue = issueRepository.findByIdAndAuthor_Id(updatedIssue.getId(), updatedIssue.getAuthor().getId()).orElseThrow(() -> {
            throw new EntityNotFoundException("No issue found with ID " + updatedIssue.getId() + " and author ID " + updatedIssue.getAuthor().getId());
        });
        issue.setIssueStatus(issueStatus);
        return issueRepository.save(issue);
    }

    @Override
    public void deleteIssue(Issue issue) {
        if (!issueRepository.existsByIdAndAuthor_Id(issue.getId(), issue.getAuthor().getId())) {
            throw new EntityNotFoundException("No issue found with ID " + issue.getId() + " and author ID " + issue.getAuthor().getId());
        }
        issueRepository.deleteById(issue.getId());
    }

}
