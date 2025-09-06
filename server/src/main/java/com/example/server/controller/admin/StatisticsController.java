package com.example.server.controller.admin;

import com.example.server.model.dto.admin.ProjectStatisticsDTO;
import com.example.server.model.dto.admin.TaskStatisticsDTO;
import com.example.server.model.dto.admin.UserStatisticsDTO;
import com.example.server.service.application.admin.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("api/v1/admin/stats")
public class StatisticsController {
    private final DashboardService dashboardService;
    @GetMapping("users")
    public ResponseEntity<UserStatisticsDTO> getUserStatistics() {
        return ResponseEntity.ok(dashboardService.getUserStatistics());
    }
    @GetMapping("projects")
    public ResponseEntity<ProjectStatisticsDTO> getProjectStatistics() {
        return ResponseEntity.ok(dashboardService.getProjectStatistics());
    }
    @GetMapping("tasks")
    public ResponseEntity<TaskStatisticsDTO> getTaskStatistics() {
        return ResponseEntity.ok(dashboardService.getTaskStatistics());
    }
}
