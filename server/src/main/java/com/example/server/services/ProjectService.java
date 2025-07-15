package com.example.server.services;

import com.example.server.dto.ProjectDTO;
import com.example.server.dto.ProjectStatisticsDTO;
import com.example.server.models.Project;
import org.springframework.data.domain.Page;

public interface ProjectService {
    Page<Project> getAllProjects(int pageNumber, int pageSize);
    Page<ProjectDTO> getAllOwnProjects(int ownerId, int pageNumber, int pageSize);
    Page<ProjectDTO> getAllJoinedProjects(int userId, int pageNumber, int pageSize);
    Project getProjectById(int id);
    ProjectDTO getOwnProjectByIdAndOwnerId(int projectId, int ownerId);
    ProjectDTO getJoinedProjectByIdAndResourceUserId(int projectId, int userId);
    ProjectStatisticsDTO getProjectStatisticsByProjectOwnerId(int ownerId);
    ProjectStatisticsDTO getProjectStatisticsByResourceUserId(int userId);
    Project addProject(Project newProject);
    Project updateProject(int id, Project updatedProject);
    void deleteProjectById(int id);
    void deleteProjectByIdAndOwnerId(int projectId, int ownerId);
}
