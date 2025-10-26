package com.example.server.model.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.time.LocalDate;
import java.util.List;


@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Task {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    @NotNull
    private String name;
    @Min(1)
    private int arrangement;
    @Column(columnDefinition = "TEXT")
    private String description;
    @ManyToOne(fetch = FetchType.LAZY)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "projectId")
    @NotNull
    private Project project;
    @Min(0)
    private int effort;
    @Min(0)
    private int baseEffort = 0;
    @Min(0)
    private int duration;
    private LocalDate start;
    private LocalDate finish;
    private LocalDate baseStart;
    private LocalDate baseFinish;
    private Integer parentId;
    private Integer predecessor;
    @Min(0)
    private float actualCost;
    @Min(0)
    private float baseCost = 0;
    @Enumerated(EnumType.STRING)
    private DependencyType dependencyType;
    @Enumerated(EnumType.STRING)
    private TaskPriority priority;
    private LocalDate completedDate;
    private boolean isLeaf = true;
    @Max(100)
    @Min(0)
    private int complete;
    @OneToMany(mappedBy = "task")
    private List<ResourceAllocation> resourceAllocations;
}
