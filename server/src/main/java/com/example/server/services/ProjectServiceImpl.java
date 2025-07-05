package com.example.server.services;

import com.example.server.dto.ProjectDTO;
import com.example.server.exception.ProjectNotFoundException;
import com.example.server.models.Project;
import com.example.server.repositories.ProjectRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Service
public class ProjectServiceImpl implements ProjectService{
    private final ProjectRepository projectRepository;
    @Override
    public Page<Project> getProjectsWithPaging(int pageNumber, int elements) {
        return projectRepository.findAll(PageRequest.of(pageNumber, elements));
    }

    @Override
    public Page<ProjectDTO> getProjectsByOwnerIdWithPaging(int id, int pageNUmber, int elements) {
        return projectRepository.findByOwnerIdWithPaging(id, PageRequest.of(pageNUmber, elements));
    }

    @Override
    public Project getProjectById(int id) {
        return null;
    }

    @Override
    public ProjectDTO getProjectByIdAndOwnerId(int id, int ownerId) {
        return projectRepository.findByIdAndOwnerId(id, ownerId).orElseThrow(() -> new ProjectNotFoundException("No project found with id {" + id + "} and ownerId {" + ownerId + "}"));
    }

    @Override
    public int insertProject(Project projectInfo) {
        Project project = projectRepository.save(projectInfo);
        return project.getId();
    }

    @Override
    public Project updateProject(int id, Project project) {
        return null;
    }

    @Override
    public void deleteProject(int id) {

    }
}
