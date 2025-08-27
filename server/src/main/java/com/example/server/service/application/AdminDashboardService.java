package com.example.server.service.application;

import com.example.server.model.dto.admin.ProjectStatisticsDTO;
import com.example.server.model.dto.admin.TaskStatisticsDTO;
import com.example.server.model.dto.admin.UserStatisticsDTO;

public interface AdminDashboardService {
    UserStatisticsDTO getUserStatistics();
    ProjectStatisticsDTO getProjectStatistics();
    TaskStatisticsDTO getTaskStatistics();
}