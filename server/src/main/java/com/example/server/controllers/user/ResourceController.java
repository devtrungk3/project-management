package com.example.server.controllers.user;

import com.example.server.dto.ResourceDTO;
import com.example.server.services.ResourceService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequestMapping("/api/v1/user/resources")
@RestController
@RequiredArgsConstructor
public class ResourceController {
    private final ResourceService resourceService;
    @GetMapping
    public ResponseEntity<List<ResourceDTO>> getAllResourcesForProjectOwner(@RequestParam("projectId") int projectId, HttpServletRequest request) {
        int userIdExtractedFromJWT = (int) request.getAttribute("userId");
        List<ResourceDTO> resources = resourceService.getAllResourcesForProjectOwner(projectId, userIdExtractedFromJWT);
        return ResponseEntity.ok(resources);
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteResource(@PathVariable(name = "id") int resourceId, HttpServletRequest request) {
        int userIdExtractedFromJWT = (int) request.getAttribute("userId");
        resourceService.deleteResourceByOwner(resourceId, userIdExtractedFromJWT);
        return ResponseEntity.noContent().build();
    }
}
