package com.example.server.model.dto;

import com.example.server.model.entity.DependencyType;
import com.example.server.model.entity.TaskPriority;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@ToString
public class TaskDTO {
    private int id;
    private String name;
    private int arrangement;
    private String description;
    private int effort;
    private int duration;
    private LocalDate start;
    private LocalDate finish;
    private LocalDate baseStart;
    private LocalDate baseFinish;
    private TaskPriority priority;
    private Integer parentId;
    private Integer predecessor;
    private DependencyType dependencyType;
    private int complete;
    private float cost;
    private List<ResourceAllocationDTO> resourceAllocations;

    public TaskDTO(int id, String name, String description, int effort, int duration, float cost, LocalDate start, LocalDate finish, LocalDate baseStart, LocalDate baseFinish, TaskPriority priority, Integer parentId, Integer predecessor, DependencyType dependencyType, int complete, List<ResourceAllocationDTO> resourceAllocations) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.effort = effort;
        this.duration = duration;
        this.cost = cost;
        this.start = start;
        this.finish = finish;
        this.baseStart = baseStart;
        this.baseFinish = baseFinish;
        this.priority = priority;
        this.parentId = parentId;
        this.predecessor = predecessor;
        this.dependencyType = dependencyType;
        this.complete = complete;
        this.resourceAllocations = resourceAllocations;
    }

    public TaskDTO(int id, String name, int arrangement, int duration, LocalDate finish, TaskPriority priority, int complete) {
        this.id = id;
        this.name = name;
        this.arrangement = arrangement;
        this.duration = duration;
        this.finish = finish;
        this.priority = priority;
        this.complete = complete;
    }
    public TaskDTO(String name, LocalDate start, LocalDate finish) {
        this.name = name;
        this.start = start;
        this.finish = finish;
    }
    public TaskDTO(String name, int complete) {
        this.name = name;
        this.complete = complete;
    }
}
