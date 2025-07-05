package com.example.server.controllers.user;

import com.example.server.dto.ProjectDTO;
import com.example.server.models.Project;
import com.example.server.models.User;
import com.example.server.services.ProjectService;
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
    @GetMapping
    public ResponseEntity<Page<ProjectDTO>> getProjectsWithPaging(@RequestParam int page, HttpServletRequest request) {
        int userId = (int) request.getAttribute("userId");
        Page<ProjectDTO> projects = projectService.getProjectsByOwnerIdWithPaging(userId, page, 5);
        return ResponseEntity.ok(projects);
    }
    @PostMapping
    public ResponseEntity<Void> insertProject(@RequestBody Project project, HttpServletRequest request) {
        int userId = (int) request.getAttribute("userId");
        User owner = new User();
        owner.setId(userId);
        project.setOwner(owner);
        int id = projectService.insertProject(project);
        return ResponseEntity.created(URI.create("api/v1/user/projects/" + id)).build();
    }
    @GetMapping("/{id}")
    public ResponseEntity<ProjectDTO> getProjectById(@PathVariable int id, HttpServletRequest request) {
        int userId = (int) request.getAttribute("userId");
        ProjectDTO project = projectService.getProjectByIdAndOwnerId(id, userId);
        return ResponseEntity.ok(project);
    }
}
