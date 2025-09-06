package com.example.server.controller.user;

import com.example.server.model.dto.user.OverviewDTO;
import com.example.server.service.application.user.DashboardService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("api/v1/user/dashboard")
public class DashboardController {
    private final DashboardService dashboardService;
    @GetMapping("/overview")
    public ResponseEntity<?> getOverviewForUser(HttpServletRequest request) {
        int userIdExtractedFromJWT = (int) request.getAttribute("userId");
        OverviewDTO overviewDTO = dashboardService.getOverviewForUser(userIdExtractedFromJWT);
        return ResponseEntity.ok(overviewDTO);
    }
}
