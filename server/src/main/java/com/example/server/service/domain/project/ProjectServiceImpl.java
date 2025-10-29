package com.example.server.service.domain.project;

import com.example.server.exception.EntityNotFoundException;
import com.example.server.model.dto.ProjectDTO;
import com.example.server.model.dto.user.ProjectStatisticsDTO;
import com.example.server.model.dto.StatusCountDTO;
import com.example.server.exception.IdNotFoundException;
import com.example.server.model.entity.*;
import com.example.server.repository.ProjectRepository;
import com.example.server.repository.ResourceRepository;
import com.example.server.repository.TagRateRepository;
import com.example.server.repository.UserRepository;
import com.example.server.util.ProjectStatusValidator;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

@RequiredArgsConstructor
@Service
public class ProjectServiceImpl implements ProjectService{
    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;
    private final ResourceRepository resourceRepository;
    private final TagRateRepository tagRateRepository;
    @Override
    public Page<Project> getAllProjects(int pageNumber, int pageSize) {
        return projectRepository.findAll(PageRequest.of(pageNumber, pageSize));
    }
    @Override
    public Page<ProjectDTO> getAllOwnProjects(int ownerId, int pageNumber, int pageSize, Map<String, Object> filters) {
        if (filters.size() == 0) {
            return projectRepository.findByOwnerIdOrderByUpdatedAtDescAndCreatedAtDesc(ownerId, PageRequest.of(pageNumber, pageSize));
        }
        return projectRepository.findByOwnerIdWithFilters(ownerId, PageRequest.of(pageNumber, pageSize), (String) filters.get("projectName"), (ProjectStatus) filters.get("projectStatus"));
    }

    @Override
    public Page<ProjectDTO> getAllJoinedProjects(int userId, int pageNumber, int pageSize, Map<String, Object> filters) {
        if (filters.size() == 0) {
            return resourceRepository.findProjectByResourceUserIdOrderByUpdatedAtDescAndCreatedAtDesc(userId, PageRequest.of(pageNumber, pageSize));
        }
        return resourceRepository.findProjectByResourceUserIdWithFilters(
                userId,
                PageRequest.of(pageNumber, pageSize),
                (String) filters.get("projectName"),
                (String) filters.get("ownerUsername"),
                (ProjectStatus) filters.get("projectStatus")
        );
    }

    @Override
    public Project getProjectById(int id) {
        return null;
    }
    @Override
    public ProjectDTO getProjectForOwner(int projectId, int ownerId) {
        return projectRepository.findDTOByIdAndOwnerId(projectId, ownerId)
                .orElseThrow(() -> new EntityNotFoundException("No project found with projectId " + projectId + " and ownerId " + ownerId));
    }

    @Override
    public ProjectDTO getJoinedProjectForUser(int projectId, int userId) {
        return resourceRepository.findProjectIdByProjectIdAndResourceUserId(projectId, userId)
                .orElseThrow(() -> new EntityNotFoundException("No project found with projectId " + projectId + " and resource user id " + userId));
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
    @Transactional
    public Project addProject(Project newProject) {
        if (!userRepository.existsById(newProject.getOwner().getId())) {
           throw new IdNotFoundException("UserId " + newProject.getOwner().getId() + " not found");
        }
        newProject.setId(0);
        Project savedProject = projectRepository.save(newProject);
        // automatically adds project owner to resource and project manager tag to tag rate
        User projectOwner = new User();
        projectOwner.setId(newProject.getOwner().getId());
        Resource resource = new Resource();
        resource.setUser(projectOwner);
        resource.setProject(savedProject);
        resourceRepository.save(resource);
        TagRate tagRate = new TagRate();
        tagRate.setTagName("PROJECT_MANAGER");
        tagRate.setProject(savedProject);
        tagRate.setRate(0);
        tagRateRepository.save(tagRate);
        return savedProject;
    }
    @Override
    public Project updateProject(int projectId, int ownerId, Project updatedProject) {
        Project oldProject = projectRepository.findByIdAndOwnerId(projectId, ownerId).orElseThrow(() -> new EntityNotFoundException("No project found with projectId " + projectId + " and ownerId " + ownerId));
        ProjectStatusValidator.validateClosedProject(oldProject);
        if (updatedProject.getName() != null && !updatedProject.getName().isEmpty()) {
            oldProject.setName(updatedProject.getName());
        }
        if (updatedProject.getDescription() != null) {
            oldProject.setDescription(updatedProject.getDescription());
        }
        if (updatedProject.getStatus() != ProjectStatus.DONE
                && updatedProject.getStatus() != ProjectStatus.CANCELLED) {
            oldProject.setStatus(updatedProject.getStatus());
        }
        if (updatedProject.getCurrency() != null) {
            oldProject.setCurrency(updatedProject.getCurrency());
        }
        return projectRepository.save(oldProject);
    }

    @Override
    public Project closeProject(int projectId, int ownerId, ProjectStatus status) {
        Project oldProject = projectRepository.findByIdAndOwnerId(projectId, ownerId).orElseThrow(() -> new EntityNotFoundException("No project found with projectId " + projectId + " and ownerId " + ownerId));
        ProjectStatusValidator.validateClosedProject(oldProject);
        oldProject.setStatus(status);
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
            throw new EntityNotFoundException("No project found with projectId " + projectId + " and ownerId " + ownerId);
    }
}
