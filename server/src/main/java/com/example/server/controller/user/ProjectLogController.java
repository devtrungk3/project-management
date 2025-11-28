package com.example.server.controller.user;

import com.example.server.model.document.ProjectActionLog;
import com.example.server.service.application.user.ProjectActionLogService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("api/v1/user/projects/{projectId}/action-log")
public class ProjectLogController {
    private final ProjectActionLogService projectActionLogService;
    @GetMapping
    public ResponseEntity<Page<ProjectActionLog>> getActionLogs(
            @RequestParam(name = "page") int page,
            @RequestParam(name = "name", required = false) String actionType,
            @PathVariable(name = "projectId") int projectId,
            HttpServletRequest request) {
        int userIdExtractedFromJWT = (int) request.getAttribute("userId");
        return ResponseEntity.ok(projectActionLogService.getProjectLogs(projectId, userIdExtractedFromJWT, page, 30));
    }
}
