package com.example.server.service.application;

import com.example.server.model.dto.UserOverviewDTO;

public interface UserDashboardService {
    UserOverviewDTO getOverviewForUser(int userId);
}
