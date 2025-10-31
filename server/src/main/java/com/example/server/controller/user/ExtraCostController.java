package com.example.server.controller.user;

import com.example.server.model.entity.ExtraCost;
import com.example.server.model.entity.Project;
import com.example.server.service.domain.extraCost.ExtraCostService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/user/projects/{projectId}/extra-costs")
@RequiredArgsConstructor
public class ExtraCostController {
    private final ExtraCostService extraCostService;
    @GetMapping
    public ResponseEntity<List<ExtraCost>> getALlExtraCosts(
            @PathVariable(name = "projectId") int projectId,
            HttpServletRequest request) {
        int userIdExtractedFromJWT = (int) request.getAttribute("userId");
        return ResponseEntity.ok(extraCostService.getAllExtraCosts(projectId, userIdExtractedFromJWT));
    }
    @PostMapping
    public ResponseEntity<ExtraCost> addExtraCost(
            @RequestBody ExtraCost newExtraCost,
            @PathVariable(name = "projectId") int projectId,
            HttpServletRequest request) {
        int userIdExtractedFromJWT = (int) request.getAttribute("userId");
        Project project = new Project();
        project.setId(projectId);
        newExtraCost.setProject(project);
        ExtraCost savedExtraCost = extraCostService.addExtraCost(newExtraCost, userIdExtractedFromJWT);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedExtraCost);
    }
    @PutMapping("/{id}")
    public ResponseEntity<ExtraCost> updateExtraCost(
            @PathVariable(name = "id") int extraCostId,
            @RequestBody ExtraCost updatedExtraCost,
            @PathVariable(name = "projectId") int projectId,
            HttpServletRequest request) {
        int userIdExtractedFromJWT = (int) request.getAttribute("userId");
        Project project = new Project();
        project.setId(projectId);
        updatedExtraCost.setId(extraCostId);
        updatedExtraCost.setProject(project);
        ExtraCost savedExtraCost = extraCostService.updateExtraCost(updatedExtraCost, userIdExtractedFromJWT);
        return ResponseEntity.ok(savedExtraCost);
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<ExtraCost> deleteExtraCost(
            @PathVariable(name = "id") int extraCostId,
            @PathVariable(name = "projectId") int projectId,
            HttpServletRequest request) {
        int userIdExtractedFromJWT = (int) request.getAttribute("userId");
        Project project = new Project();
        project.setId(projectId);
        ExtraCost deletedExtraCost = new ExtraCost();
        deletedExtraCost.setId(extraCostId);
        deletedExtraCost.setProject(project);
        extraCostService.deleteExtraCost(deletedExtraCost, userIdExtractedFromJWT);
        return ResponseEntity.noContent().build();
    }
}
