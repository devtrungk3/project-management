package com.example.server.controllers.user;

import com.example.server.dto.JoinRequestDTO;
import com.example.server.models.JoinRequest;
import com.example.server.services.JoinRequestService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("api/v1/user/join-requests")
public class JoinRequestController {
    private final JoinRequestService joinRequestService;
    @PostMapping
    public ResponseEntity<Void> addJoinRequest(@RequestBody JoinRequestDTO newJoinRequestDTO, HttpServletRequest request) {
        int userIdExtractedFromJWT = (int) request.getAttribute("userId");
        JoinRequest newJoinRequest = new JoinRequest(userIdExtractedFromJWT, newJoinRequestDTO.getProjectId());
        joinRequestService.addJoinRequest(newJoinRequest);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }
    @GetMapping("/incoming")
    public ResponseEntity<Page<JoinRequestDTO>> getAllIncomingJoinRequests(@RequestParam int page, HttpServletRequest request) {
        int userIdExtractedFromJWT = (int) request.getAttribute("userId");
        Page<JoinRequestDTO> joinRequestResult = joinRequestService.getAllJoinRequestsByProjectOwnerId(userIdExtractedFromJWT, page, 5);
        return ResponseEntity.ok(joinRequestResult);
    }
    @GetMapping("/outgoing")
    public ResponseEntity<Page<JoinRequestDTO>> getAllOutgoingJoinRequests(@RequestParam int page, HttpServletRequest request) {
        int userIdExtractedFromJWT = (int) request.getAttribute("userId");
        Page<JoinRequestDTO> joinRequestResult = joinRequestService.getAllJoinRequestsByUserId(userIdExtractedFromJWT, page, 5);
        return ResponseEntity.ok(joinRequestResult);
    }
    @PatchMapping("/{id}")
    public ResponseEntity<Void> updateJoinRequest(@PathVariable("id") int joinRequestId, @RequestBody JoinRequest updatedJoinRequest, HttpServletRequest request) {
        int userIdExtractedFromJWT = (int) request.getAttribute("userId");
        updatedJoinRequest.setId(joinRequestId);
        joinRequestService.updateJoinRequest(userIdExtractedFromJWT, updatedJoinRequest);
        return ResponseEntity.noContent().build();
    }
}
