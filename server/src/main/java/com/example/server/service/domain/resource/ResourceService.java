package com.example.server.service.domain.resource;

import com.example.server.model.dto.ResourceDTO;
import com.example.server.model.entity.Resource;

import java.util.List;

public interface ResourceService {
    Resource addResource(Resource newResource);
    List<ResourceDTO> getAllResourcesForProjectOwner(int projectId, int ownerId);
    Resource deleteResourceByOwner(int resourceId, int ownerId);
    Double getAvgResourceOverdueRate(List<Resource> resources, int userId);
}
