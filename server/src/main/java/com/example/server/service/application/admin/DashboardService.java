package com.example.server.service.application.admin;

import com.example.server.model.dto.admin.ProjectStatisticsDTO;
import com.example.server.model.dto.admin.TaskStatisticsDTO;
import com.example.server.model.dto.admin.UserStatisticsDTO;

public interface DashboardService {
    UserStatisticsDTO getUserStatistics();
    ProjectStatisticsDTO getProjectStatistics();
    TaskStatisticsDTO getTaskStatistics();
}