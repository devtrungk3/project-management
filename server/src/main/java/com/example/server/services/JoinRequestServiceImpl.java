package com.example.server.services;

import com.example.server.dto.JoinRequestDTO;
import com.example.server.exception.*;
import com.example.server.models.JoinRequest;
import com.example.server.models.Resource;
import com.example.server.repositories.JoinRequestRepository;
import com.example.server.repositories.ProjectRepository;
import com.example.server.repositories.ResourceRepository;
import com.example.server.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
@RequiredArgsConstructor
@Service
public class JoinRequestServiceImpl implements JoinRequestService {
    private final JoinRequestRepository joinRequestRepository;
    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;
    private final ResourceRepository resourceRepository;
    private final ResourceService resourceService;
    @Override
    @Transactional
    public JoinRequest addJoinRequest(JoinRequest newJoinRequest) {
        int userId = newJoinRequest.getUser().getId();
        int projectId = newJoinRequest.getProject().getId();
        if (!projectRepository.existsById(projectId)) {
            throw new IdNotFoundException("ProjectId " + projectId + " not found");
        }
        if (!userRepository.existsById(userId)) {
            throw new IdNotFoundException("UserId " + userId + " not found");
        }
        if (joinRequestRepository.existsByUserIdAndProjectIdAndAcceptFlagIsNull(userId, projectId)) {
            throw new JoinRequestExistsException("JoinRequest with userId " + userId + " and projectId " + projectId + " already exists");
        }
        if (projectRepository.existsByIdAndOwnerId(projectId, userId)) {
            throw new SelfJoinRequestNotAllowException("UserId " + userId + " cannot add joinRequest with own project");
        }
        if (resourceRepository.existsByUserIdAndProjectId(userId, projectId)) {
            throw new ResourceExistsException("Cannot add joinRequest with userId " + userId +" and projectId" + projectId + " because this resource already exists");
        }
        joinRequestRepository.deleteByUserIdAndProjectId(userId, projectId);
        joinRequestRepository.flush();
        return joinRequestRepository.save(newJoinRequest);
    }

    @Override
    @Transactional
    public JoinRequest updateJoinRequest(int projectOwnerId, JoinRequest updatedJoinRequest) {
        if (updatedJoinRequest.getAcceptFlag() == null) {
            throw new InvalidJoinRequestException("AcceptFlag in updatedJoinRequest cannot be null");
        }
        JoinRequest oldJoinRequest = joinRequestRepository.findByIdAndProjectOwnerId(updatedJoinRequest.getId(), projectOwnerId)
                .orElseThrow(() -> new JoinRequestNotFoundException("JoinRequest with id " + updatedJoinRequest.getId() + " and project owner id " + projectOwnerId + " not found"));
        if (oldJoinRequest.getAcceptFlag() != null) {
            throw new InvalidJoinRequestException("JoinRequest with not null accept flag cannot be change");
        }
        if (updatedJoinRequest.getAcceptFlag()) {
            Resource newResource = new Resource();
            newResource.setUser(oldJoinRequest.getUser());
            newResource.setProject(oldJoinRequest.getProject());
            resourceService.addResource(newResource);
        }
        oldJoinRequest.setAcceptFlag(updatedJoinRequest.getAcceptFlag());
        return joinRequestRepository.save(oldJoinRequest);
    }

    @Override
    public Page<JoinRequestDTO> getAllJoinRequestsForProjectOwner(int ownerId, int pageNumber, int pageSize) {
        return joinRequestRepository.findByProjectOwnerIdOrderByCreatedAtDesc(ownerId, PageRequest.of(pageNumber, pageSize));
    }

    @Override
    public Page<JoinRequestDTO> getAllJoinRequestsByUserId(int userId, int pageNumber, int pageSize) {
        return joinRequestRepository.findByUserIdOrderByCreatedAtDesc(userId, PageRequest.of(pageNumber, pageSize));
    }
}
