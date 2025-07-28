package com.example.server.services;

import com.example.server.dto.ResourceAllocationDTO;
import com.example.server.dto.TaskDTO;
import com.example.server.exception.ProjectNotFoundException;
import com.example.server.models.*;
import com.example.server.repositories.ProjectRepository;
import com.example.server.repositories.ResourceAllocationRepository;
import com.example.server.repositories.ResourceRepository;
import com.example.server.repositories.TaskRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TaskServiceImpl implements TaskService {
    private final TaskRepository taskRepository;
    private final ResourceAllocationRepository resourceAllocationRepository;
    private final ProjectRepository projectRepository;
    private final ResourceRepository resourceRepository;
    @Override
    public List<TaskDTO> getAllProjectTasksForOwner(int projectId, int ownerId) {
        // get all tasks for project owner
        List<Task> tasks = taskRepository.findTasksByProjectIdAndProjectOwnerId(projectId, ownerId);
        if (tasks.size() == 0) {
            return List.of();
        }
        // get all resource allocations for project owner
        List<ResourceAllocationDTO> resourceAllocations =
                resourceAllocationRepository.findAllResourceAllocationsByProjectIdAndProjectOwnerId(projectId, ownerId);
        return combineTasksAndResourceAllocations(tasks, resourceAllocations);
    }

    @Override
    public List<TaskDTO> getAllAssignedTasksForUser(int projectId, int userId) {
        // get all assigned tasks for user
        List<Task> tasks = taskRepository.findTasksByProjectIdAndResourceAllocationUserId(projectId, userId);
        if (tasks.size() == 0) {
            return List.of();
        }
        // get all resource allocations for user
        List<ResourceAllocationDTO> resourceAllocations =
                resourceAllocationRepository.findAllResourceAllocationsByProjectIdAndResourceUserId(projectId, userId);
        return combineTasksAndResourceAllocations(tasks, resourceAllocations);
    }

    @Override
    @Transactional
    public void syncTasks(List<TaskDTO> newTaskDTOs, int projectId, int ownerId) {
        // validate project owner
        Project project = projectRepository.findByIdAndOwnerId(projectId, ownerId).orElseThrow(() -> new ProjectNotFoundException("No project found with projectId " + projectId + " and ownerId " + ownerId));

        List<Integer> preservedTaskIds = new ArrayList<>();
        List<ResourceAllocationPK> preservedResourceAllocationIds = new ArrayList<>();

        // map task dto to entity list
        List<Task> savedTasks = newTaskDTOs.stream().map(taskDTO -> {
            Task newTask = new Task();
            if (taskDTO.getId() > 0) {
                if (taskRepository.existsByIdAndProjectId(taskDTO.getId(), project.getId())) {
                    preservedTaskIds.add(taskDTO.getId());
                    newTask.setId(taskDTO.getId());
                } else {
                    throw new IllegalArgumentException("No task found with taskId " + taskDTO.getId() + " and projectId " + project.getId());
                }
            } else {
                newTask.setId(0);
            }
            newTask.setName(taskDTO.getName());
            newTask.setLevel(taskDTO.getLevel());
            newTask.setArrangement(taskDTO.getArrangement());
            newTask.setDescription(taskDTO.getDescription());
            newTask.setProject(project);
            newTask.setEffort(taskDTO.getEffort());
            newTask.setDuration(taskDTO.getDuration());
            newTask.setStart(taskDTO.getStart());
            newTask.setFinish(taskDTO.getFinish());
            newTask.setComplete(taskDTO.getComplete());
            return newTask;
        }).toList();
        // delete tasks in project, which not in user input
        if (preservedTaskIds.isEmpty()) {
            taskRepository.deleteByProjectId(projectId);
        } else {
            taskRepository.deleteByProjectIdAndIdNotIn(projectId, preservedTaskIds);
        }
        // insert new tasks and update old tasks
        savedTasks = taskRepository.saveAll(savedTasks);

        // map resource allocation dto to entity list
        List<ResourceAllocation> savedResourceAllocations = new ArrayList<>();
        for (int i=0; i<savedTasks.size(); i++) {
            Task savedTask = savedTasks.get(i);
            TaskDTO newTaskDTO = newTaskDTOs.get(i);
            for (ResourceAllocationDTO resourceAllocationDTO : newTaskDTO.getResourceAllocations()) {
                if (!resourceRepository.existsById(resourceAllocationDTO.getResourceId())) {
                    throw new IllegalArgumentException("ResourceId " + resourceAllocationDTO.getResourceId() + " not found");
                }
                Resource resourceRef = new Resource();
                resourceRef.setId(resourceAllocationDTO.getResourceId());

                ResourceAllocationPK newResourceAllocationPK = new ResourceAllocationPK(resourceRef.getId(), savedTask.getId());

                ResourceAllocation newResourceAllocation = new ResourceAllocation();
                newResourceAllocation.setId(newResourceAllocationPK);
                newResourceAllocation.setResource(resourceRef);
                newResourceAllocation.setTask(savedTask);

                savedResourceAllocations.add(newResourceAllocation);
                preservedResourceAllocationIds.add(newResourceAllocationPK);
            }
        }
        // delete resource allocations with ids not in user input
        if (preservedResourceAllocationIds.isEmpty()) {
            resourceAllocationRepository.deleteByProjectId(projectId);
        } else {
            resourceAllocationRepository.deleteByProjectIdAndIdNotIn(projectId, preservedResourceAllocationIds);
        }
        // insert new resource allocations and update old resource allocations
        resourceAllocationRepository.saveAll(savedResourceAllocations);
    }

    private List<TaskDTO> combineTasksAndResourceAllocations(List<Task> tasks, List<ResourceAllocationDTO> resourceAllocations) {
        // group resource allocations by taskId
        Map<Integer, List<ResourceAllocationDTO>> allocationMap = resourceAllocations.stream()
                .collect(Collectors.groupingBy(ResourceAllocationDTO::getTaskId));
        return tasks.stream()
                .map(task -> new TaskDTO(
                        task.getId(),
                        task.getName(),
                        task.getLevel(),
                        task.getDescription(),
                        task.getEffort(),
                        task.getDuration(),
                        task.getStart(),
                        task.getFinish(),
                        task.getComplete(),
                        allocationMap.getOrDefault(task.getId(), List.of())
                ))
                .toList();
    }
}
