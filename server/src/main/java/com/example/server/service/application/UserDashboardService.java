package com.example.server.service.application;

import com.example.server.model.dto.user.OverviewDTO;

public interface UserDashboardService {
    OverviewDTO getOverviewForUser(int userId);
}
