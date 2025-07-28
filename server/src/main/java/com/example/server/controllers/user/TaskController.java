package com.example.server.controllers.user;

import com.example.server.dto.TaskDTO;
import com.example.server.services.TaskService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/v1/user/tasks")
@RequiredArgsConstructor
public class TaskController {
    private final TaskService taskService;
    @GetMapping
    public ResponseEntity<List<TaskDTO>> getAllProjectTasksForOwner(@RequestParam("projectId") int projectId, HttpServletRequest request) {
        int userIdExtractedFromJWT = (int) request.getAttribute("userId");
        return ResponseEntity.ok(taskService.getAllProjectTasksForOwner(projectId, userIdExtractedFromJWT));
    }
    @GetMapping("/joined")
    public ResponseEntity<List<TaskDTO>> getAllAssignedTasksForUser(@RequestParam("projectId") int projectId, HttpServletRequest request) {
        int userIdExtractedFromJWT = (int) request.getAttribute("userId");
        return ResponseEntity.ok(taskService.getAllAssignedTasksForUser(projectId, userIdExtractedFromJWT));
    }
    @PostMapping
    public ResponseEntity<?> syncTasks(@RequestBody List<TaskDTO> newTaskDTOs, @RequestParam("projectId") int projectId, HttpServletRequest request) {
        int userIdExtractedFromJWT = (int) request.getAttribute("userId");
        taskService.syncTasks(newTaskDTOs, projectId, userIdExtractedFromJWT);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }
}
