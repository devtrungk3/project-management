package com.example.server.controller.user;

import com.example.server.model.dto.ProjectDTO;
import com.example.server.model.dto.user.ProjectStatisticsDTO;
import com.example.server.model.entity.Project;
import com.example.server.model.entity.ProjectStatus;
import com.example.server.model.entity.User;
import com.example.server.service.domain.project.ProjectService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.HashMap;
import java.util.Map;

@RestController("userProjectController")
@RequiredArgsConstructor
@RequestMapping("api/v1/user/projects")
public class ProjectController {
    private final ProjectService projectService;
    @GetMapping("/my-projects")
    public ResponseEntity<Page<ProjectDTO>> getAllMyProjects(
            @RequestParam(name = "page") int page,
            @RequestParam(name = "name", required = false) String projectName,
            @RequestParam(name = "status", required = false) ProjectStatus projectStatus,
            HttpServletRequest request) {
        int userIdExtractedFromJWT = (int) request.getAttribute("userId");
        Map<String, Object> filters = new HashMap<>();
        if (projectName != null) {
            filters.put("projectName", projectName);
        }
        if (projectStatus != null) {
            filters.put("projectStatus", projectStatus);
        }
        Page<ProjectDTO> projects = projectService.getAllOwnProjects(userIdExtractedFromJWT, page, 5, filters);
        return ResponseEntity.ok(projects);
    }
    @GetMapping("/joined-projects")
    public ResponseEntity<Page<ProjectDTO>> getAllJoinedProjects(
            @RequestParam int page,
            @RequestParam(name = "name", required = false) String projectName,
            @RequestParam(name = "owner", required = false) String ownerUsername,
            @RequestParam(name = "status", required = false) ProjectStatus projectStatus,
            HttpServletRequest request) {
        int userIdExtractedFromJWT = (int) request.getAttribute("userId");
        Map<String, Object> filters = new HashMap<>();
        if (projectName != null) {
            filters.put("projectName", projectName);
        }
        if (ownerUsername != null) {
            filters.put("ownerUsername", ownerUsername);
        }
        if (projectStatus != null) {
            filters.put("projectStatus", projectStatus);
        }
        Page<ProjectDTO> projects = projectService.getAllJoinedProjects(userIdExtractedFromJWT, page, 5, filters);
        return ResponseEntity.ok(projects);
    }
    @PostMapping
    public ResponseEntity<Void> addProject(@RequestBody Project newProject, HttpServletRequest request) {
        int userIdExtractedFromJWT = (int) request.getAttribute("userId");
        User owner = new User();
        owner.setId(userIdExtractedFromJWT);
        newProject.setOwner(owner);
        int savedProjectId = projectService.addProject(newProject).getId();
        return ResponseEntity.created(URI.create("api/v1/user/projects/" + savedProjectId)).build();
    }
    @PatchMapping("/{id}")
    public ResponseEntity<ProjectDTO> updateProject(@PathVariable(name = "id") int projectId, @RequestBody Project updatedProject, HttpServletRequest request) {
        int userIdExtractedFromJWT = (int) request.getAttribute("userId");
        Project projectAfterUpdate = projectService.updateProject(projectId, userIdExtractedFromJWT, updatedProject);
        ProjectDTO projectDTO = new ProjectDTO(
                projectAfterUpdate.getId(),
                projectAfterUpdate.getName(),
                projectAfterUpdate.getDescription(),
                projectAfterUpdate.getStatus(),
                projectAfterUpdate.getOwner().getUsername(),
                projectAfterUpdate.getPlannedBudget(),
                projectAfterUpdate.getCurrency(),
                projectAfterUpdate.getCreatedAt(),
                projectAfterUpdate.getUpdatedAt()
        );
        return ResponseEntity.ok(projectDTO);
    }
    @PatchMapping("/{id}/cancel")
    public ResponseEntity<?> cancelProject(@PathVariable(name = "id") int projectId, HttpServletRequest request) {
        int userIdExtractedFromJWT = (int) request.getAttribute("userId");
        Project cancelledProject = projectService.cancelProject(projectId, userIdExtractedFromJWT);
        ProjectDTO projectDTO = new ProjectDTO(
                cancelledProject.getId(),
                cancelledProject.getName(),
                cancelledProject.getDescription(),
                cancelledProject.getStatus(),
                cancelledProject.getOwner().getUsername(),
                cancelledProject.getPlannedBudget(),
                cancelledProject.getCurrency(),
                cancelledProject.getCreatedAt(),
                cancelledProject.getUpdatedAt()
        );
        return ResponseEntity.ok(projectDTO);
    }
    @GetMapping("/{id}")
    public ResponseEntity<ProjectDTO> getOwnProjectById(@PathVariable(name = "id") int projectId, HttpServletRequest request) {
        int userIdExtractedFromJWT = (int) request.getAttribute("userId");
        ProjectDTO project = projectService.getProjectForOwner(projectId, userIdExtractedFromJWT);
        return ResponseEntity.ok(project);
    }
    @GetMapping("/joined/{id}")
    public ResponseEntity<ProjectDTO> getJoinedProjectById(@PathVariable(name = "id") int projectId, HttpServletRequest request) {
        int userIdExtractedFromJWT = (int) request.getAttribute("userId");
        ProjectDTO project = projectService.getJoinedProjectForUser(projectId, userIdExtractedFromJWT);
        return ResponseEntity.ok(project);
    }
    @GetMapping("/my-projects-statistics")
    public ResponseEntity<?> getMyProjectsStatistics(HttpServletRequest request) {
        int userIdExtractedFromJWT = (int) request.getAttribute("userId");
        ProjectStatisticsDTO statistics = projectService.getProjectStatisticsForOwner(userIdExtractedFromJWT);
        return ResponseEntity.ok(statistics);
    }
    @GetMapping("/joined-projects-statistics")
    public ResponseEntity<?> getJoinedProjectsStatistics(HttpServletRequest request) {
        int userIdExtractedFromJWT = (int) request.getAttribute("userId");
        ProjectStatisticsDTO statistics = projectService.getJoinedProjectStatisticsForUser(userIdExtractedFromJWT);
        return ResponseEntity.ok(statistics);
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteProject(@PathVariable(name = "id") int projectId, HttpServletRequest request) {
        int userIdExtractedFromJWT = (int) request.getAttribute("userId");
        projectService.deleteProjectByOwner(projectId, userIdExtractedFromJWT);
        return ResponseEntity.noContent().build();
    }
}
