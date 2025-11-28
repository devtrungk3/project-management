package com.example.server.service.domain.issue;

import com.example.server.model.dto.IssueDTO;
import com.example.server.model.dto.IssueDetailDTO;
import com.example.server.model.entity.Issue;

import java.util.List;

public interface IssueService {
    List<IssueDTO> getIssuesByProjectAndUser(int projectId, int userId);
    IssueDetailDTO getIssueById(int issueId, int projectId, int userId);
    Issue addIssue(Issue issue);
    Issue closeIssue(Issue issue);
    Issue openIssue(Issue issue);
    Issue deleteIssue(Issue issue);
}
