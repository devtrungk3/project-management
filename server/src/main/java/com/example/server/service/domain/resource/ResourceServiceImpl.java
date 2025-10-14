package com.example.server.service.domain.resource;

import com.example.server.exception.EntityNotFoundException;
import com.example.server.model.dto.ResourceDTO;
import com.example.server.exception.IdNotFoundException;
import com.example.server.exception.ResourceExistsException;
import com.example.server.model.entity.Resource;
import com.example.server.repository.ProjectRepository;
import com.example.server.repository.ResourceRepository;
import com.example.server.repository.UserRepository;
import com.example.server.util.ProjectStatusValidator;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ResourceServiceImpl implements ResourceService{
    private final ResourceRepository resourceRepository;
    private final UserRepository userRepository;
    private final ProjectRepository projectRepository;
    @Override
    public Resource addResource(Resource newResource) {
        if (!userRepository.existsById(newResource.getUser().getId())) {
            throw new IdNotFoundException("UserId " + newResource.getUser().getId() + " not found");
        }
        if (!projectRepository.existsById(newResource.getProject().getId())) {
            throw new IdNotFoundException("ProjectId " + newResource.getUser().getId() + " not found");
        }
        if (resourceRepository.existsByUserIdAndProjectId(newResource.getUser().getId(), newResource.getProject().getId())) {
            throw new ResourceExistsException("Resource with userId " + newResource.getUser().getId() +" and projectId" + newResource.getProject().getId() + " already exists");
        }
        newResource.setId(0);
        return resourceRepository.save(newResource);
    }
    @Override
    public List<ResourceDTO> getAllResourcesForProjectOwner(int projectId, int ownerId) {
        return resourceRepository.findByProjectIdAndProjectOwnerId(projectId, ownerId);
    }

    @Override
    public void deleteResourceByOwner(int resourceId, int ownerId) {
        Resource resource = resourceRepository.findByIdAndProject_Owner_Id(resourceId, ownerId)
                .orElseThrow(() -> new EntityNotFoundException("No resource found with id " + resourceId + " and project owner id " + ownerId));
        if (resource.getUser().getId() == ownerId) {
            throw new IllegalArgumentException("Cannot delete Project manager resource");
        }
        ProjectStatusValidator.validateClosedProject(resource.getProject());
        resourceRepository.delete(resource);
    }
}
