package com.example.server.service.domain.task;

import com.example.server.exception.EntityNotFoundException;
import com.example.server.exception.IdNotFoundException;
import com.example.server.model.dto.ResourceAllocationDTO;
import com.example.server.model.dto.TaskDTO;
import com.example.server.exception.ProjectNotInProgressException;
import com.example.server.model.entity.*;
import com.example.server.repository.ProjectRepository;
import com.example.server.repository.ResourceAllocationRepository;
import com.example.server.repository.ResourceRepository;
import com.example.server.repository.TaskRepository;
import com.example.server.util.ProjectStatusValidator;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.*;
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
        return combineTasksAndResourceAllocations(tasks, resourceAllocations, true);
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
                resourceAllocationRepository.findAllResourceAllocationsByProjectIdAndTaskIdIn(projectId, tasks.stream().map(Task::getId).toList());
        return combineTasksAndResourceAllocations(tasks, resourceAllocations, false);
    }
    private List<TaskDTO> combineTasksAndResourceAllocations(List<Task> tasks, List<ResourceAllocationDTO> resourceAllocations, boolean forOwner) {
        // group resource allocations by taskId
        Map<Integer, List<ResourceAllocationDTO>> allocationMap = resourceAllocations.stream()
                .collect(Collectors.groupingBy(ResourceAllocationDTO::getTaskId));
        return tasks.stream()
                .map(task -> {
                    TaskDTO taskDTO = new TaskDTO(
                        task.getId(),
                        task.getName(),
                        task.getDescription(),
                        forOwner ? task.getEffort() : 0,
                        task.getDuration(),
                        forOwner ? task.getActualCost() : 0,
                        task.getStart(),
                        task.getFinish(),
                        forOwner ? task.getBaseStart() : null,
                        forOwner ? task.getBaseFinish() : null,
                        task.getPriority(),
                        task.getParentId(),
                        forOwner ? task.getPredecessor() : null,
                        forOwner ? task.getDependencyType() : null,
                        task.getComplete(),
                        allocationMap.getOrDefault(task.getId(), List.of())
                    );
                    return taskDTO;
                }).toList();
    }
    private LocalDate calculateTaskCompleteDate(int complete, LocalDate oldCompleteDate) {
        if (complete == 100) {
            return Objects.requireNonNullElseGet(oldCompleteDate, LocalDate::now);
        }
        return null;
    }
    @Override
    @Transactional
    public void syncTasks(List<TaskDTO> newTaskDTOs, int projectId, int ownerId) {
        // validate project owner
        Project project = projectRepository.findByIdAndOwnerId(projectId, ownerId).orElseThrow(() -> new EntityNotFoundException("No project found with projectId " + projectId + " and ownerId " + ownerId));
        // validate project's state
        ProjectStatusValidator.validateClosedProject(project);
        List<Task> availableTasksInDB = taskRepository.findByProject_Id(project.getId());
        Map<Integer, Task> preservedTasksChecker = availableTasksInDB.stream()
                .collect(Collectors.toMap(Task::getId, task -> task));

        // map task dto to entity list
        List<Task> savedTasks = new ArrayList<>();
        for (int i=0; i<newTaskDTOs.size(); i++) {
            TaskDTO taskDTO = newTaskDTOs.get(i);
            if (i > 0 && i < newTaskDTOs.size()-1) {
                // check task leaf
                if (taskDTO.getParentId() != null && taskDTO.getParentId() == newTaskDTOs.get(i-1).getId()) {
                    savedTasks.get(i - 1).setLeaf(false);
                    savedTasks.get(i - 1).setBaseCost(0);
                    savedTasks.get(i - 1).setActualCost(0);
                }
                // check arrangement
                if (taskDTO.getArrangement() != newTaskDTOs.get(i-1).getArrangement()+1) {
                    throw new IllegalArgumentException("Task sequence is invalid");
                }
            }
            Task newTask = new Task();
            if  (preservedTasksChecker.containsKey(taskDTO.getId())) {
                Task oldTask = preservedTasksChecker.get(taskDTO.getId());
                // take old base cost
                newTask.setBaseCost(oldTask.getBaseCost());
                // take old base time
                newTask.setBaseStart(oldTask.getBaseStart());
                newTask.setBaseFinish(oldTask.getBaseFinish());
                // take old base effort
                newTask.setBaseEffort(oldTask.getBaseEffort());
                // check task completion
                newTask.setCompletedDate(calculateTaskCompleteDate(newTask.getComplete(), oldTask.getCompletedDate()));
                // set null for preserved task
                preservedTasksChecker.put(taskDTO.getId(), null);
                newTask.setId(taskDTO.getId());
            } else {
                newTask.setId(0);
            }
            newTask.setName(taskDTO.getName());
            newTask.setArrangement(taskDTO.getArrangement());
            newTask.setDescription(taskDTO.getDescription());
            newTask.setProject(project);
            newTask.setEffort(taskDTO.getEffort());
            newTask.setDuration(taskDTO.getDuration());
            newTask.setActualCost(taskDTO.getCost());
            // project in the planning state -> set task's base cost, base effort
            if (project.getStatus() == ProjectStatus.PLANNING) {
                newTask.setBaseCost(taskDTO.getCost());
                newTask.setBaseEffort(taskDTO.getEffort());
            }
            newTask.setStart(taskDTO.getStart());
            newTask.setFinish(taskDTO.getFinish());
            // new task or project in the planning state
            // allow assigning task base time
            if (newTask.getId() == 0 || project.getStatus() == ProjectStatus.PLANNING) {
                newTask.setBaseStart(taskDTO.getStart());
                newTask.setBaseFinish(taskDTO.getFinish());
            }
            newTask.setParentId(taskDTO.getParentId());
            newTask.setPredecessor(taskDTO.getPredecessor());
            if (taskDTO.getPredecessor() != null) {
                newTask.setDependencyType(taskDTO.getDependencyType());
            }
            newTask.setComplete(taskDTO.getComplete());
            newTask.setPriority(taskDTO.getPriority());
            savedTasks.add(newTask);
        }
        // delete tasks in project, which not in user input (not null value in preservedTasksChecker)
        Set<Integer> preservedTaskIds = preservedTasksChecker.entrySet().stream()
                .filter(task -> task.getValue() == null)
                .map(Map.Entry::getKey)
                .collect(Collectors.toSet());
        if (preservedTaskIds.isEmpty()) {
            taskRepository.deleteByProject_Id(project.getId());
        } else {
            taskRepository.deleteByProject_IdAndIdNotIn(project.getId(), preservedTaskIds);
        }
        // insert new tasks and update old tasks
        savedTasks = taskRepository.saveAll(savedTasks);

        List<ResourceAllocationPK> preservedResourceAllocationIds = new ArrayList<>();
        // map resource allocation dto to entity list
        List<ResourceAllocation> savedResourceAllocations = new ArrayList<>();

        Set<Integer> availableResourceIdsInDB = resourceRepository.findIdsByProjectId(project.getId());
        for (int i=0; i<savedTasks.size(); i++) {
            Task savedTask = savedTasks.get(i);
            TaskDTO newTaskDTO = newTaskDTOs.get(i);
            for (ResourceAllocationDTO resourceAllocationDTO : newTaskDTO.getResourceAllocations()) {
                if (!availableResourceIdsInDB.contains(resourceAllocationDTO.getResourceId())) {
                    throw new IdNotFoundException("ResourceId " + resourceAllocationDTO.getResourceId() + " not found");
                }
                Resource resourceRef = new Resource();
                resourceRef.setId(resourceAllocationDTO.getResourceId());

                ResourceAllocationPK newResourceAllocationPK = new ResourceAllocationPK(resourceRef.getId(), savedTask.getId());

                ResourceAllocation newResourceAllocation = new ResourceAllocation();
                newResourceAllocation.setId(newResourceAllocationPK);
                newResourceAllocation.setResource(resourceRef);
                newResourceAllocation.setTask(savedTask);
                // set tag rate
                if (resourceAllocationDTO.getTagRateId() > 0) {
                    TagRate tagRateRef = new TagRate();
                    tagRateRef.setId(resourceAllocationDTO.getTagRateId());
                    newResourceAllocation.setTagRate(tagRateRef);
                }

                savedResourceAllocations.add(newResourceAllocation);
                preservedResourceAllocationIds.add(newResourceAllocationPK);
            }
        }
        // delete resource allocations with ids not in user input
        if (preservedResourceAllocationIds.isEmpty()) {
            resourceAllocationRepository.deleteByProjectId(project.getId());
        } else {
            resourceAllocationRepository.deleteByProjectIdAndIdNotIn(project.getId(), preservedResourceAllocationIds);
        }
        // insert new resource allocations and update old resource allocations
        resourceAllocationRepository.saveAll(savedResourceAllocations);
    }

    @Override
    @Transactional
    public void updateTaskCompleteForUser(List<TaskDTO> newTaskDTOs, int projectId, int userId) {
        if (newTaskDTOs.size() == 0) {
            return;
        }
        List<Task> oldTasks = taskRepository.findTasksByProjectIdAndResourceAllocationUserId(projectId, userId);
        if (oldTasks.size() == 0) {
            return;
        }
        Project project = projectRepository.findById(projectId).orElseThrow(() -> new EntityNotFoundException("ProjectId " + projectId + " not found"));
        // validate project's state
        ProjectStatusValidator.validateClosedProject(project);
        if (project.getStatus() != ProjectStatus.IN_PROGRESS) {
            throw new ProjectNotInProgressException("UserId " + userId + " cannot update task complete because project with id " + projectId + " is not in progress");
        }
        Map<Integer, Integer> newTaskDTOMap = newTaskDTOs.stream()
                .collect(Collectors.toMap(TaskDTO::getId, TaskDTO::getComplete));
        oldTasks.forEach(oldTask -> {
            Integer newTaskComplete = newTaskDTOMap.get(oldTask.getId());
            if (newTaskComplete != null &&
                    oldTask.getStart() != null &&
                    (oldTask.getStart().isEqual(LocalDate.now()) || oldTask.getStart().isBefore(LocalDate.now()))
            ) {
                oldTask.setComplete(newTaskComplete);
                oldTask.setCompletedDate(calculateTaskCompleteDate(newTaskComplete, oldTask.getCompletedDate()));
            }
        });
    }
}
