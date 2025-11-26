package com.example.server.model.dto;

import com.example.server.model.enums.IssueStatus;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
public class IssueDetailDTO {
    private int id;
    private String title;
    private String description;
    private IssueStatus issueStatus;
    private String author;
    private LocalDateTime createdAt;
    private List<IssueCommentDTO> comments;
}
