package com.example.server.controller.user;

import com.example.server.model.dto.ProjectDTO;
import com.example.server.model.dto.user.ProjectStatisticsDTO;
import com.example.server.model.entity.Project;
import com.example.server.model.entity.User;
import com.example.server.service.domain.project.ProjectService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;

@RestController("userProjectController")
@RequiredArgsConstructor
@RequestMapping("api/v1/user/projects")
public class ProjectController {
    private final ProjectService projectService;
    @GetMapping("/my-projects")
    public ResponseEntity<Page<ProjectDTO>> getAllMyProjects(@RequestParam int page, HttpServletRequest request) {
        int userIdExtractedFromJWT = (int) request.getAttribute("userId");
        Page<ProjectDTO> projects = projectService.getAllOwnProjects(userIdExtractedFromJWT, page, 5);
        return ResponseEntity.ok(projects);
    }
    @GetMapping("/joined-projects")
    public ResponseEntity<Page<ProjectDTO>> getAllJoinedProjects(@RequestParam int page, HttpServletRequest request) {
        int userIdExtractedFromJWT = (int) request.getAttribute("userId");
        Page<ProjectDTO> projects = projectService.getAllJoinedProjects(userIdExtractedFromJWT, page, 5);
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
                projectAfterUpdate.getCreatedAt(),
                projectAfterUpdate.getUpdatedAt()
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
