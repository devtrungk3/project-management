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
    ProjectDTO getProjectForOwner(int projectId, int ownerId);
    ProjectDTO getJoinedProjectForUser(int projectId, int userId);
    ProjectStatisticsDTO getProjectStatisticsForOwner(int ownerId);
    ProjectStatisticsDTO getJoinedProjectStatisticsForUser(int userId);
    Project addProject(Project newProject);
    Project updateProject(int id, Project updatedProject);
    void deleteProjectById(int id);
    void deleteProjectByOwner(int projectId, int ownerId);
}
