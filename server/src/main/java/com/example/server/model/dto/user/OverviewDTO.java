package com.example.server.model.dto.user;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import java.util.HashMap;
import java.util.Map;

@Setter
@Getter
@NoArgsConstructor
@ToString
public class OverviewDTO {
    private long myActiveTasks;
    private long myOverdueTasks;
    private long pendingIncomingJoinRequests;
    private Map<String, Long> assignedTaskStatuses;
    private Map<String, Long> assignedTaskPriorities;
    private Map<String, Long> upcomingTasksIn10Days;

    public OverviewDTO(Long myActiveTasks,
                       Long myOverdueTasks,
                       Long todoTasks,
                       Long inProgressTasks,
                       Long doneTasks,
                       Long lowPriorityTasks,
                       Long mediumPriorityTasks,
                       Long highPriorityTasks) {
        this.myActiveTasks = myActiveTasks != null ? myActiveTasks : 0L;
        this.myOverdueTasks = myOverdueTasks != null ? myOverdueTasks : 0L;
        Map<String, Long> assignedTaskStatuses = new HashMap<>();
        assignedTaskStatuses.put("TODO", todoTasks);
        assignedTaskStatuses.put("IN_PROGRESS", inProgressTasks);
        assignedTaskStatuses.put("DONE", doneTasks);
        this.assignedTaskStatuses = assignedTaskStatuses;
        Map<String, Long> assignedTaskPriorities = new HashMap<>();
        assignedTaskPriorities.put("LOW", lowPriorityTasks);
        assignedTaskPriorities.put("MEDIUM", mediumPriorityTasks);
        assignedTaskPriorities.put("HIGH", highPriorityTasks);
        this.assignedTaskPriorities = assignedTaskPriorities;
    }
}
