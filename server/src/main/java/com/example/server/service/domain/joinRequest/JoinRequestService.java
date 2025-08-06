package com.example.server.service.domain.joinRequest;

import com.example.server.model.dto.JoinRequestDTO;
import com.example.server.model.entity.JoinRequest;
import org.springframework.data.domain.Page;

public interface JoinRequestService {
    JoinRequest addJoinRequest(JoinRequest newJoinRequest);
    JoinRequest updateJoinRequest(int projectOwnerId, JoinRequest updatedJoinRequest);
    Page<JoinRequestDTO> getAllJoinRequestsForProjectOwner(int ownerId, int pageNumber, int pageSize);
    Page<JoinRequestDTO> getAllJoinRequestsByUserId(int userId, int pageNumber, int pageSize);
}
