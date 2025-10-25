package com.example.server.controller.user;

import com.example.server.model.dto.TaskDTO;
import com.example.server.model.dto.user.CostOverviewReportDTO;
import com.example.server.model.dto.user.ProjectOverviewReportDTO;
import com.example.server.service.application.user.ReportService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("api/v1/user/reports/{id}")
@RequiredArgsConstructor
public class ReportController {
    private final ReportService reportService;
    @GetMapping("/project-overview")
    public ResponseEntity<ProjectOverviewReportDTO> getProjectOverviewReport(@PathVariable(name = "id") int projectId, HttpServletRequest request) {
        int userIdExtractedFromJWT = (int) request.getAttribute("userId");
        return ResponseEntity.ok(reportService.getProjectOverviewReport(userIdExtractedFromJWT, projectId));
    }
    @GetMapping("/upcoming-tasks")
    public ResponseEntity<Map<String, List<TaskDTO>>> getUpcomingTasksReport(@PathVariable(name = "id") int projectId, HttpServletRequest request) {
        int userIdExtractedFromJWT = (int) request.getAttribute("userId");
        List<TaskDTO> upcomingTasks = reportService.getTasksStartingInNextDays(userIdExtractedFromJWT, projectId, 7);
        List<TaskDTO> tasksDueThisWeek = reportService.getTasksDueThisWeek(userIdExtractedFromJWT, projectId);
        return ResponseEntity.ok(Map.of(
                "tasks_starting_soon", upcomingTasks,
                "tasks_due_this_week", tasksDueThisWeek
        ));
    }
    @GetMapping("/cost-overview")
    public ResponseEntity<CostOverviewReportDTO> getCostOverviewReport(@PathVariable(name = "id") int projectId, HttpServletRequest request) {
        int userIdExtractedFromJWT = (int) request.getAttribute("userId");
        return ResponseEntity.ok(reportService.getCostOverviewReport(userIdExtractedFromJWT, projectId));
    }
}
