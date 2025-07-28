package com.example.server.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
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
    @Min(1)
    private int level;
    private String description;
    @ManyToOne
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JsonIgnore
    @JoinColumn(name = "projectId")
    @NotNull
    private Project project;
    @Min(0)
    private Float effort;
    @Min(0)
    private Float duration;
    private LocalDate start;
    private LocalDate finish;
    @Max(100)
    @Min(0)
    private int complete;
    @OneToMany(mappedBy = "task", fetch = FetchType.LAZY)
    private List<ResourceAllocation> resourceAllocations;
}
