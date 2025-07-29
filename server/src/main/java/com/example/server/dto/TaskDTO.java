package com.example.server.dto;

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
    private float effort;
    private float duration;
    private LocalDate start;
    private LocalDate finish;
    private int complete;
    private List<ResourceAllocationDTO> resourceAllocations;

    public TaskDTO(int id, String name, String description, float effort, float duration, LocalDate start, LocalDate finish, int complete, List<ResourceAllocationDTO> resourceAllocations) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.effort = effort;
        this.duration = duration;
        this.start = start;
        this.finish = finish;
        this.complete = complete;
        this.resourceAllocations = resourceAllocations;
    }
}
