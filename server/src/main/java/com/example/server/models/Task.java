package com.example.server.models;

import jakarta.persistence.*;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;


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
    @JoinColumn(name = "projectId")
    private Project project;
    @Min(0)
    private float effort;
    @Min(0)
    private float duration;
    private LocalDate start;
    private LocalDate finish;
    @Max(100)
    @Min(0)
    private int complete;
    private int precesscor;
}
