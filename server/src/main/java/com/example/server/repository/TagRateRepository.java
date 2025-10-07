package com.example.server.repository;

import com.example.server.model.entity.TagRate;
import org.springframework.data.repository.CrudRepository;

import java.util.List;
import java.util.Optional;

public interface TagRateRepository extends CrudRepository<TagRate, Integer> {
    List<TagRate> findByProject_IdAndProject_Owner_IdOrderByIdDesc(int projectId, int ownerId);
    Optional<TagRate> findByIdAndProject_Owner_Id(int id, int ownerId);
}
