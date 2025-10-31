package com.example.server.service.domain.extraCost;

import com.example.server.exception.EntityNotFoundException;
import com.example.server.model.entity.ExtraCost;
import com.example.server.repository.ExtraCostRepository;
import com.example.server.repository.ProjectRepository;
import jakarta.persistence.EntityManager;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
@Service
@RequiredArgsConstructor
public class ExtraCostServiceImpl implements ExtraCostService{
    private final ExtraCostRepository extraCostRepository;
    private final ProjectRepository projectRepository;
    private final EntityManager entityManager;
    @Override
    public List<ExtraCost> getAllExtraCosts(int projectId, int ownerId) {
        return extraCostRepository.findByProject_IdAndProject_Owner_Id(projectId, ownerId);
    }

    @Override
    @Transactional
    public ExtraCost addExtraCost(ExtraCost newExtraCost, int ownerId) {
        if (!projectRepository.existsByIdAndOwnerId(newExtraCost.getProject().getId(), ownerId)) {
            throw new EntityNotFoundException("No project found with projectId " + newExtraCost.getProject().getId() + " and ownerId " + ownerId);
        }
        newExtraCost.setId(0);
        ExtraCost savedExtraCost = extraCostRepository.saveAndFlush(newExtraCost);
        entityManager.refresh(savedExtraCost);
        return savedExtraCost;
    }

    @Override
    public ExtraCost updateExtraCost(ExtraCost updatedExtraCost, int ownerId) {
        if (!projectRepository.existsByIdAndOwnerId(updatedExtraCost.getProject().getId(), ownerId)) {
            throw new EntityNotFoundException("No project found with projectId " + updatedExtraCost.getProject().getId() + " and ownerId " + ownerId);
        }
        if (!extraCostRepository.existsByIdAndProject_Id(updatedExtraCost.getId(), updatedExtraCost.getProject().getId())) {
            throw new EntityNotFoundException("No extra cost found with id " + updatedExtraCost.getId() + " and projectId " + updatedExtraCost.getProject().getId());
        }
        return extraCostRepository.save(updatedExtraCost);
    }

    @Override
    public void deleteExtraCost(ExtraCost deletedExtraCost, int ownerId) {
        if (!projectRepository.existsByIdAndOwnerId(deletedExtraCost.getProject().getId(), ownerId)) {
            throw new EntityNotFoundException("No project found with projectId " + deletedExtraCost.getProject().getId() + " and ownerId " + ownerId);
        }
        if (!extraCostRepository.existsByIdAndProject_Id(deletedExtraCost.getId(), deletedExtraCost.getProject().getId())) {
            throw new EntityNotFoundException("No extra cost found with id " + deletedExtraCost.getId() + " and projectId " + deletedExtraCost.getProject().getId());
        }
        extraCostRepository.delete(deletedExtraCost);
    }
}
