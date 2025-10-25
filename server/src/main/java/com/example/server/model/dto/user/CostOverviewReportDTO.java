package com.example.server.model.dto.user;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.util.Map;

@Getter
@Setter
@ToString
public class CostOverviewReportDTO {
    private double plannedCost;
    private double actualCost;
    private double remainingCost;
    private Map<String, Double> resourceWithCost;

    public CostOverviewReportDTO(double plannedCost, double actualCost, double remainingCost) {
        this.plannedCost = plannedCost;
        this.actualCost = actualCost;
        this.remainingCost = remainingCost;
    }
}
