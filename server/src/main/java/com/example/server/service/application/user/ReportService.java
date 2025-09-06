package com.example.server.service.application.user;

import com.example.server.model.dto.user.ProjectOverviewReportDTO;

public interface ReportService {
    ProjectOverviewReportDTO getProjectOverviewReport(int userId, int projectId);
}
