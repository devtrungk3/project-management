package com.example.server.model.dto.admin;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@NoArgsConstructor
public class TaskStatisticsDTO {
    private long totalTasks;
    private long completedTasks;
    private long overdueTasks;

    public TaskStatisticsDTO(Long totalTasks, Long completedTasks, Long overdueTasks) {
        this.totalTasks = totalTasks != null ? totalTasks : 0L;
        this.completedTasks = completedTasks != null ? completedTasks : 0L;
        this.overdueTasks = overdueTasks != null ? overdueTasks : 0L;
    }
}
