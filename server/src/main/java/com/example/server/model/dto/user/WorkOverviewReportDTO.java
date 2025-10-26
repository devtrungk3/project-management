package com.example.server.model.dto.user;

import lombok.Getter;
import lombok.Setter;

import java.util.Map;

@Getter
@Setter
public class WorkOverviewReportDTO {
    private double plannedEffort;
    private double actualEffort;
    private double remainingEffort;
    private Map<String, Integer> resourceWithEffort;

    public WorkOverviewReportDTO(double plannedEffort, double actualEffort, double remainingEffort) {
        this.plannedEffort = plannedEffort;
        this.actualEffort = actualEffort;
        this.remainingEffort = remainingEffort;
    }
}
