package com.example.server.service.application.user;

import com.example.server.model.dto.user.OverviewDTO;

public interface DashboardService {
    OverviewDTO getOverviewForUser(int userId);
}
