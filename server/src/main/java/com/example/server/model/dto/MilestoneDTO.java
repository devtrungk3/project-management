package com.example.server.model.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Setter
@Getter
@AllArgsConstructor
public class MilestoneDTO {
    private int id;
    private String name;
    private LocalDate finish;
    private int complete;
}
