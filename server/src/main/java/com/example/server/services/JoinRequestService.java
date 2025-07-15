package com.example.server.services;

import com.example.server.dto.JoinRequestDTO;
import com.example.server.models.JoinRequest;
import org.springframework.data.domain.Page;

public interface JoinRequestService {
    JoinRequest addJoinRequest(JoinRequest newJoinRequest);
    JoinRequest updateJoinRequest(int projectOwnerId, JoinRequest updatedJoinRequest);
    Page<JoinRequestDTO> getAllJoinRequestsByProjectOwnerId(int ownerId, int pageNumber, int pageSize);
    Page<JoinRequestDTO> getAllJoinRequestsByUserId(int userId, int pageNumber, int pageSize);
}
