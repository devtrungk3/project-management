package com.example.server.controller.user;

import com.example.server.model.dto.IssueDTO;
import com.example.server.model.dto.IssueDetailDTO;
import com.example.server.model.entity.ExtraCost;
import com.example.server.model.entity.Issue;
import com.example.server.model.entity.Project;
import com.example.server.model.entity.User;
import com.example.server.service.domain.issue.IssueService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/user/projects/{projectId}/issues")
@RequiredArgsConstructor
public class IssueController {
    private final IssueService issueService;
    @GetMapping
    public ResponseEntity<List<IssueDTO>> getIssues(
            @PathVariable(name = "projectId") int projectId,
            HttpServletRequest request) {
        int userIdExtractedFromJWT = (int) request.getAttribute("userId");
        return ResponseEntity.ok(issueService.getIssuesByProjectAndUser(projectId, userIdExtractedFromJWT));
    }
    @GetMapping("/{id}")
    public ResponseEntity<IssueDetailDTO> getIssue(
            @PathVariable(name = "projectId") int projectId,
            @PathVariable(name = "id") int issueId,
            HttpServletRequest request) {
        int userIdExtractedFromJWT = (int) request.getAttribute("userId");
        return ResponseEntity.ok(issueService.getIssueById(issueId, projectId, userIdExtractedFromJWT));
    }
    @PostMapping
    public ResponseEntity<Issue> addIssue(
            @RequestBody Issue newIssue,
            @PathVariable(name = "projectId") int projectId,
            HttpServletRequest request) {
        int userIdExtractedFromJWT = (int) request.getAttribute("userId");
        Project project = new Project();
        project.setId(projectId);
        User user = new User();
        user.setId(userIdExtractedFromJWT);
        newIssue.setProject(project);
        newIssue.setAuthor(user);
        return ResponseEntity.status(HttpStatus.CREATED).body(issueService.addIssue(newIssue));
    }
    @PatchMapping("/{id}/open")
    public ResponseEntity<Issue> openIssue(
            @PathVariable(name = "id") int issueId,
            @PathVariable(name = "projectId") int projectId,
            HttpServletRequest request) {
        int userIdExtractedFromJWT = (int) request.getAttribute("userId");
        User user = new User();
        user.setId(userIdExtractedFromJWT);
        Project project = new Project();
        project.setId(projectId);
        Issue issue = new Issue();
        issue.setId(issueId);
        issue.setAuthor(user);
        issue.setProject(project);
        return ResponseEntity.ok(issueService.openIssue(issue));
    }
    @PatchMapping("/{id}/closed")
    public ResponseEntity<Issue> closeIssue(
            @PathVariable(name = "id") int issueId,
            @PathVariable(name = "projectId") int projectId,
            HttpServletRequest request) {
        int userIdExtractedFromJWT = (int) request.getAttribute("userId");
        User user = new User();
        user.setId(userIdExtractedFromJWT);
        Project project = new Project();
        project.setId(projectId);
        Issue issue = new Issue();
        issue.setId(issueId);
        issue.setAuthor(user);
        issue.setProject(project);
        return ResponseEntity.ok(issueService.closeIssue(issue));
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<ExtraCost> deleteIssue(
            @PathVariable(name = "id") int issueId,
            @PathVariable(name = "projectId") int projectId,
            HttpServletRequest request) {
        int userIdExtractedFromJWT = (int) request.getAttribute("userId");
        User user = new User();
        user.setId(userIdExtractedFromJWT);
        Project project = new Project();
        project.setId(projectId);
        Issue issue = new Issue();
        issue.setId(issueId);
        issue.setAuthor(user);
        issue.setProject(project);
        issueService.deleteIssue(issue);
        return ResponseEntity.noContent().build();
    }
}
