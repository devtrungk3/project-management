package com.example.server.service.domain.project;

import com.example.server.model.dto.ProjectDTO;
import com.example.server.model.dto.user.ProjectStatisticsDTO;
import com.example.server.model.entity.Project;
import com.example.server.model.entity.ProjectStatus;
import org.springframework.data.domain.Page;

import java.util.Map;

public interface ProjectService {
    Page<Project> getAllProjects(int pageNumber, int pageSize);
    Page<ProjectDTO> getAllOwnProjects(int ownerId, int pageNumber, int pageSize, Map<String, Object> filters);
    Page<ProjectDTO> getAllJoinedProjects(int userId, int pageNumber, int pageSize, Map<String, Object> filters);
    Project getProjectById(int id);
    ProjectDTO getProjectForOwner(int projectId, int ownerId);
    ProjectDTO getJoinedProjectForUser(int projectId, int userId);
    ProjectStatisticsDTO getProjectStatisticsForOwner(int ownerId);
    ProjectStatisticsDTO getJoinedProjectStatisticsForUser(int userId);
    Project addProject(Project newProject);
    Project updateProject(int projectId, int ownerId, Project updatedProject);
    Project closeProject(int projectId, int ownerId, ProjectStatus status);
    void deleteProjectById(int id);
    void deleteProjectByOwner(int projectId, int ownerId);
}
