package com.example.server.service.domain.resource;

import com.example.server.annotation.LogAction;
import com.example.server.exception.EntityNotFoundException;
import com.example.server.model.dto.ResourceDTO;
import com.example.server.exception.IdNotFoundException;
import com.example.server.exception.ResourceExistsException;
import com.example.server.model.entity.Resource;
import com.example.server.repository.ProjectRepository;
import com.example.server.repository.ResourceRepository;
import com.example.server.repository.TaskRepository;
import com.example.server.repository.UserRepository;
import com.example.server.util.ProjectStatusValidator;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ResourceServiceImpl implements ResourceService{
    private final ResourceRepository resourceRepository;
    private final UserRepository userRepository;
    private final ProjectRepository projectRepository;
    private final TaskRepository taskRepository;
    private final CacheManager cacheManager;
    @Override
    @CacheEvict(value = "resourceInProject", key = "{#result.project.id, #result.project.owner.id}")
    @LogAction(actionType = "member_added")
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
    @Cacheable(value = "resourceInProject", key = "{#projectId, #ownerId}", unless = "#result == null or #result.size()<5")
    public List<ResourceDTO> getAllResourcesForProjectOwner(int projectId, int ownerId) {
        return resourceRepository.findByProjectIdAndProjectOwnerId(projectId, ownerId);
    }

    @Override
    @LogAction(actionType = "member_removed")
    public Resource deleteResourceByOwner(int resourceId, int ownerId) {
        Resource resource = resourceRepository.findByIdAndProject_Owner_Id(resourceId, ownerId)
                .orElseThrow(() -> new EntityNotFoundException("No resource found with id " + resourceId + " and project owner id " + ownerId));
        if (resource.getUser().getId() == ownerId) {
            throw new IllegalArgumentException("Cannot delete Project manager resource");
        }
        ProjectStatusValidator.validateClosedProject(resource.getProject());
        resourceRepository.delete(resource);
        cacheManager.getCache("resourceInProject").evictIfPresent(new Object[]{
                resource.getProject().getId(),
                resource.getProject().getOwner().getId()
        });
        return resource;
    }
    @Override
    @Transactional
    public Double getAvgResourceOverdueRate(List<Resource> resources, int userId) {
        if (resources.size() == 0) return null;
        double sumOfOverdueRate = 0;
        for (Resource resource : resources) {
            Resource resourceInDB = resourceRepository.findByIdAndProject_Owner_Id(resource.getId(), userId).orElse(null);
            if (resourceInDB == null) {
                return null;
            }
            Double overdueRate = taskRepository.getOverdueRateByUserAfter(
                    resourceInDB.getUser().getId(),
                    LocalDate.now().minusDays(30)
            );
            if (overdueRate != null) {
                sumOfOverdueRate += overdueRate;
            }
        }
        return sumOfOverdueRate/resources.size();
    }
}
