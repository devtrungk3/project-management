package com.example.server.model.dto.user;

import com.example.server.model.dto.MilestoneDTO;
import com.example.server.model.dto.TaskDTO;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.util.List;

@Setter
@Getter
@NoArgsConstructor
public class ProjectOverviewReportDTO {
    private LocalDate projectStart;
    private LocalDate projectFinish;
    private double projectComplete;
    private List<MilestoneDTO> upcomingMilestones;
    private List<TaskDTO> overdueTasks;

    public ProjectOverviewReportDTO(LocalDate projectStart, LocalDate projectFinish) {
        this.projectStart = projectStart;
        this.projectFinish = projectFinish;
    }

    public void setProjectComplete(Double projectComplete) {
        this.projectComplete = projectComplete != null ? projectComplete : 0;
    }
}
