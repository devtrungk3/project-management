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
    private float effort;
    @Min(0)
    private float duration;
    private LocalDate start;
    private LocalDate finish;
    @Enumerated(EnumType.STRING)
    private TaskPriority priority;
    @Max(100)
    @Min(0)
    private int complete;
    @OneToMany(mappedBy = "task")
    private List<ResourceAllocation> resourceAllocations;
}
