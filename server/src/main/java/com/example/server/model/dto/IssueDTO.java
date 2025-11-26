package com.example.server.model.dto;

import com.example.server.model.enums.IssueStatus;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;
@Data
@AllArgsConstructor
public class IssueDTO {
    private int id;
    private String title;
    private String description;
    private IssueStatus issueStatus;
    private String author;
    private LocalDateTime createdAt;
    private long commentCount;
}
