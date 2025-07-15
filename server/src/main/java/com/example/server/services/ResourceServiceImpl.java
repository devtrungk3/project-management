package com.example.server.services;

import com.example.server.exception.IdNotFoundException;
import com.example.server.exception.ResourceExistsException;
import com.example.server.models.Resource;
import com.example.server.repositories.ProjectRepository;
import com.example.server.repositories.ResourceRepository;
import com.example.server.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

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
}
