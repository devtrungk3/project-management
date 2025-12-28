package com.example.server.controller.admin;

import com.example.server.model.dto.admin.ProjectDTOForAdmin;
import com.example.server.service.domain.project.ProjectService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController("adminProjectController")
@RequiredArgsConstructor
@RequestMapping("api/v1/admin/projects")
public class ProjectController {
    private final ProjectService projectService;
    @GetMapping
    public ResponseEntity<Page<ProjectDTOForAdmin>> getProjectsForAdmin(@RequestParam(name = "page") int page) {
        return ResponseEntity.ok(projectService.getProjectsForAdmin(page, 10));
    }
}
