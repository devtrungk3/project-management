package com.example.server.service.domain.extraCost;

import com.example.server.model.entity.ExtraCost;

import java.util.List;

public interface ExtraCostService {
    List<ExtraCost> getAllExtraCosts(int projectId, int ownerId);
    ExtraCost addExtraCost(ExtraCost newExtraCost, int ownerId);
    ExtraCost updateExtraCost(ExtraCost updatedExtraCost, int ownerId);
    void deleteExtraCost(ExtraCost deletedExtraCost, int ownerId);
}
