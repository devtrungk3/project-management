package com.example.server.services;

import com.example.server.dto.ProjectDTO;
import com.example.server.models.Project;
import org.springframework.data.domain.Page;

public interface ProjectService {
    Page<Project> getProjectsWithPaging(int pageNumber, int elements);
    Page<ProjectDTO> getProjectsByOwnerIdWithPaging(int id, int pageNUmber, int elements);
    Project getProjectById(int id);
    ProjectDTO getProjectByIdAndOwnerId(int id, int ownerId);
    int insertProject(Project project);
    Project updateProject(int id, Project project);
    void deleteProject(int id);
}
