package com.example.server.model.dto.admin;

import com.example.server.model.dto.StatusCountDTO;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import java.util.Map;

@Getter
@Setter
@NoArgsConstructor
public class ProjectStatisticsDTO {
    private long totalProjects;
    private long completedProjects;
    private long cancelledProjects;
    private long projectGrowthCount;
    private double projectGrowthRate;
    private Map<Integer, Long> newProjectInYear;
    private List<TopProjectManagerDTO> topProjectManager;
    private double successRate;
    private List<StatusCountDTO> statusCounts;

    public ProjectStatisticsDTO(Long totalProjects, Long completedProjects, Long cancelledProjects) {
        this.totalProjects = totalProjects != null ? totalProjects : 0L;
        this.completedProjects = completedProjects != null ? completedProjects : 0L;
        this.cancelledProjects = cancelledProjects != null ? cancelledProjects : 0L;
    }
    public void setProjectGrowthCount(Long projectGrowthCount) {
        this.projectGrowthCount = projectGrowthCount != null ? projectGrowthCount : 0L;
    }
    public void setProjectGrowthRate(Double projectGrowthRate) {
        this.projectGrowthRate = projectGrowthRate != null ? projectGrowthRate : 0.0;
    }
    public double getProjectGrowRate() {
        BigDecimal bigDecimal = new BigDecimal(String.valueOf(this.projectGrowthRate)).setScale(2, RoundingMode.HALF_UP);
        return bigDecimal.doubleValue();
    }
    public void setSuccessRate(Double successRate) {
        this.successRate = successRate != null ? successRate : 0.0;
    }
    public double getSuccessRate() {
        BigDecimal bigDecimal = new BigDecimal(String.valueOf(this.successRate)).setScale(2, RoundingMode.HALF_UP);
        return bigDecimal.doubleValue();
    }
}
