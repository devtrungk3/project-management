package com.example.server.services;

import com.example.server.dto.ResourceDTO;
import com.example.server.models.Resource;

import java.util.List;

public interface ResourceService {
    Resource addResource(Resource newResource);
    List<ResourceDTO> getAllResourcesForProjectOwner(int projectId, int ownerId);
}
