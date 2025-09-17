package com.example.server.service.domain.tagRate;

import com.example.server.exception.EntityNotFoundException;
import com.example.server.exception.IdNotFoundException;
import com.example.server.model.entity.TagRate;
import com.example.server.repository.ProjectRepository;
import com.example.server.repository.TagRateRepository;
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
        if (!projectRepository.existsByIdAndOwnerId(newTagRate.getProject().getId(), ownerId)) {
            throw new EntityNotFoundException("No project found with projectId " + newTagRate.getProject().getId() + " and ownerId " + ownerId);
        }
        newTagRate.setId(0);
        return tagRateRepository.save(newTagRate);
    }

    @Override
    public TagRate updateTagRate(TagRate updatedTagRate, int ownerId) {
        if (!projectRepository.existsByIdAndOwnerId(updatedTagRate.getProject().getId(), ownerId)) {
            throw new EntityNotFoundException("No project found with projectId " + updatedTagRate.getProject().getId() + " and ownerId " + ownerId);
        }
        if (!tagRateRepository.existsById(updatedTagRate.getId())) {
            throw new IdNotFoundException("TagRateId " + updatedTagRate.getId() + " not found");
        }
        return tagRateRepository.save(updatedTagRate);
    }

    @Override
    public void deleteTagRate(int tagRateId, int ownerId) {
        if (!tagRateRepository.existsByIdAndProject_Owner_Id(tagRateId, ownerId)) {
            throw new EntityNotFoundException("No TagRate found with tagRateId " + tagRateId + " and ownerId " + ownerId);
        }
        else {
            tagRateRepository.deleteById(tagRateId);
        }
    }
}
