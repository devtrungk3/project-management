package com.example.server.controller.user;

import com.example.server.model.dto.user.ProjectOverviewReportDTO;
import com.example.server.service.application.user.ReportService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("api/v1/user/reports")
@RequiredArgsConstructor
public class ReportController {
    private final ReportService reportService;
    @GetMapping("/{id}/project-overview")
    public ResponseEntity<ProjectOverviewReportDTO> getProjectOverviewReport(@PathVariable(name = "id") int projectId, HttpServletRequest request) {
        int userIdExtractedFromJWT = (int) request.getAttribute("userId");
        return ResponseEntity.ok(reportService.getProjectOverviewReport(userIdExtractedFromJWT, projectId));
    }
}
