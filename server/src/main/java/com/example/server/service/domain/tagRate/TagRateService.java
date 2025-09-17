package com.example.server.service.domain.tagRate;

import com.example.server.model.entity.TagRate;

import java.util.List;

public interface TagRateService {
    List<TagRate> getTagRatesByProjectAndOwner(int projectId, int ownerId);
    TagRate addTagRate(TagRate newTagRate, int ownerId);
    TagRate updateTagRate(TagRate updatedTagRate, int ownerId);
    void deleteTagRate(int tagRateId, int ownerId);
}
