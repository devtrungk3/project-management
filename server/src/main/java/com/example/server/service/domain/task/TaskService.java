package com.example.server.service.domain.task;

import com.example.server.model.dto.TaskDTO;

import java.util.List;

public interface TaskService {
    List<TaskDTO> getAllProjectTasksForOwner(int projectId, int ownerId);
    List<TaskDTO> getAllAssignedTasksForUser(int projectId, int ownerId);
    void syncTasks(List<TaskDTO> newTaskDTOs, int projectId, int ownerId);
    void updateTaskCompleteForUser(List<TaskDTO> newTaskDTOs, int projectId, int userId);
}
