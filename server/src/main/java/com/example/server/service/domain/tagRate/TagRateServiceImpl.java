package com.example.server.service.domain.tagRate;

import com.example.server.exception.EntityNotFoundException;
import com.example.server.exception.IdNotFoundException;
import com.example.server.model.entity.Project;
import com.example.server.model.entity.TagRate;
import com.example.server.repository.ProjectRepository;
import com.example.server.repository.TagRateRepository;
import com.example.server.util.ProjectStatusValidator;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TagRateServiceImpl implements TagRateService{
    private final TagRateRepository tagRateRepository;
    private final ProjectRepository projectRepository;

    @Override
    public List<TagRate> getTagRatesByProjectAndOwner(int projectId, int ownerId) {
        return tagRateRepository.findByProject_IdAndProject_Owner_IdOrderByIdDesc(projectId, ownerId);
    }

    @Override
    public TagRate addTagRate(TagRate newTagRate, int ownerId) {
        Project project = projectRepository.findByIdAndOwnerId(newTagRate.getProject().getId(), ownerId).orElseThrow(() ->
            new EntityNotFoundException("No project found with projectId " + newTagRate.getProject().getId() + " and ownerId " + ownerId));
        ProjectStatusValidator.validateClosedProject(project);
        newTagRate.setId(0);
        return tagRateRepository.save(newTagRate);
    }

    @Override
    public TagRate updateTagRate(TagRate updatedTagRate, int ownerId) {
        Project project = projectRepository.findByIdAndOwnerId(updatedTagRate.getProject().getId(), ownerId).orElseThrow(() ->
                new EntityNotFoundException("No project found with projectId " + updatedTagRate.getProject().getId() + " and ownerId " + ownerId));
        ProjectStatusValidator.validateClosedProject(project);
        if (!tagRateRepository.existsById(updatedTagRate.getId())) {
            throw new IdNotFoundException("TagRateId " + updatedTagRate.getId() + " not found");
        }
        return tagRateRepository.save(updatedTagRate);
    }

    @Override
    public void deleteTagRate(int tagRateId, int ownerId) {
        TagRate tagRate = tagRateRepository.findByIdAndProject_Owner_Id(tagRateId, ownerId).orElseThrow(() ->
            new EntityNotFoundException("No TagRate found with tagRateId " + tagRateId + " and ownerId " + ownerId));
        ProjectStatusValidator.validateClosedProject(tagRate.getProject());
        tagRateRepository.delete(tagRate);
    }
}
