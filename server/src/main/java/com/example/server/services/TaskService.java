package com.example.server.services;

import com.example.server.dto.TaskDTO;

import java.util.List;

public interface TaskService {
    List<TaskDTO> getAllProjectTasksForOwner(int projectId, int ownerId);
    List<TaskDTO> getAllAssignedTasksForUser(int projectId, int ownerId);
    void syncTasks(List<TaskDTO> tasks, int projectId, int ownerId);
}
