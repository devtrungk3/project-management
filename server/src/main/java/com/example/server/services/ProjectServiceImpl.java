package com.example.server.services;

import com.example.server.dto.ProjectDTO;
import com.example.server.dto.ProjectStatisticsDTO;
import com.example.server.dto.StatusCountDTO;
import com.example.server.exception.IdNotFoundException;
import com.example.server.exception.ProjectNotFoundException;
import com.example.server.models.Project;
import com.example.server.repositories.ProjectRepository;
import com.example.server.repositories.ResourceRepository;
import com.example.server.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.List;

@RequiredArgsConstructor
@Service
public class ProjectServiceImpl implements ProjectService{
    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;
    private final ResourceRepository resourceRepository;
    @Override
    public Page<Project> getAllProjects(int pageNumber, int pageSize) {
        return projectRepository.findAll(PageRequest.of(pageNumber, pageSize));
    }
    @Override
    public Page<ProjectDTO> getAllOwnProjects(int ownerId, int pageNumber, int pageSize) {
        return projectRepository.findByOwnerIdOrderByUpdatedAtDescAndCreatedAtDesc(ownerId, PageRequest.of(pageNumber, pageSize));
    }

    @Override
    public Page<ProjectDTO> getAllJoinedProjects(int userId, int pageNumber, int pageSize) {
        return resourceRepository.findProjectByResourceUserIdOrderByUpdatedAtDescAndCreatedAtDesc(userId, PageRequest.of(pageNumber, pageSize));
    }

    @Override
    public Project getProjectById(int id) {
        return null;
    }
    @Override
    public ProjectDTO getProjectForOwner(int projectId, int ownerId) {
        return projectRepository.findDTOByIdAndOwnerId(projectId, ownerId)
                .orElseThrow(() -> new ProjectNotFoundException("No project found with projectId " + projectId + " and ownerId " + ownerId));
    }

    @Override
    public ProjectDTO getJoinedProjectForUser(int projectId, int userId) {
        return resourceRepository.findProjectIdByProjectIdAndResourceUserId(projectId, userId)
                .orElseThrow(() -> new ProjectNotFoundException("No project found with projectId " + projectId + " and resource user id " + userId));
    }

    @Override
    public ProjectStatisticsDTO getProjectStatisticsForOwner(int ownerId) {
        List<StatusCountDTO> statusCounts = projectRepository.countByStatusForOwner(ownerId);
        return new ProjectStatisticsDTO(statusCounts);
    }

    @Override
    public ProjectStatisticsDTO getJoinedProjectStatisticsForUser(int userId) {
        List<StatusCountDTO> statusCounts = resourceRepository.countByStatusForUser(userId);
        return new ProjectStatisticsDTO(statusCounts);
    }

    @Override
    public Project addProject(Project newProject) {
        if (!userRepository.existsById(newProject.getOwner().getId())) {
           throw new IdNotFoundException("UserId " + newProject.getOwner().getId() + " not found");
        }
        newProject.setId(0);
        return projectRepository.save(newProject);
    }
    @Override
    public Project updateProject(int projectId, int ownerId, Project updatedProject) {
        Project oldProject = projectRepository.findByIdAndOwnerId(projectId, ownerId).orElseThrow(() -> new ProjectNotFoundException("No project found with projectId " + projectId + " and ownerId " + ownerId));
        if (updatedProject.getName() != null && !updatedProject.getName().isEmpty()) {
            oldProject.setName(updatedProject.getName());
        }
        if (updatedProject.getDescription() != null) {
            oldProject.setDescription(updatedProject.getDescription());
        }
        if (updatedProject.getStatus() != null) {
            oldProject.setStatus(updatedProject.getStatus());
        }
        return projectRepository.save(oldProject);
    }

    @Override
    public void deleteProjectById(int id) {
        if (projectRepository.existsById(id))
            projectRepository.deleteById(id);
        else
            throw new IdNotFoundException("ProjectId " + id + " not found");
    }
    @Override
    public void deleteProjectByOwner(int projectId, int ownerId) {
        if (projectRepository.existsByIdAndOwnerId(projectId, ownerId))
            projectRepository.deleteById(projectId);
        else
            throw new ProjectNotFoundException("No project found with projectId " + projectId + " and ownerId " + ownerId);
    }
}
