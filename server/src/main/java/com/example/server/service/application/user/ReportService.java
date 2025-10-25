package com.example.server.service.application.user;

import com.example.server.model.dto.TaskDTO;
import com.example.server.model.dto.user.CostOverviewReportDTO;
import com.example.server.model.dto.user.ProjectOverviewReportDTO;

import java.util.List;

public interface ReportService {
    ProjectOverviewReportDTO getProjectOverviewReport(int userId, int projectId);
    List<TaskDTO> getTasksStartingInNextDays(int ownerId, int projectId, int numberOfDays);
    List<TaskDTO> getTasksDueThisWeek(int ownerId, int projectId);
    CostOverviewReportDTO getCostOverviewReport(int userId, int projectId);
}
