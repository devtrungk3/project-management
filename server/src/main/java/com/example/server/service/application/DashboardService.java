package com.example.server.service.application;

import com.example.server.model.dto.UserOverviewDTO;

public interface DashboardService {
    UserOverviewDTO getOverviewForUser(int userId);
}
