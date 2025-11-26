package com.example.server.repository;

import com.example.server.model.dto.IssueDTO;
import com.example.server.model.entity.Issue;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;

import java.util.List;
import java.util.Optional;

public interface IssueRepository extends CrudRepository<Issue, Integer> {
    Optional<Issue> findByIdAndProject_Id(int id, int projectId);
    Optional<Issue> findByIdAndAuthor_Id(int id, int userId);
    boolean existsByIdAndAuthor_Id(int id, int userId);
    @Query("""
        SELECT new com.example.server.model.dto.IssueDTO(
            i.id,
            i.title,
            i.description,
            i.issueStatus,
            i.author.username,
            i.createdAt,
            COUNT(c.id)
        )
        FROM Issue i
        LEFT JOIN IssueComment c ON c.issue.id = i.id
        GROUP BY i.id, i.author.username
        ORDER BY i.createdAt DESC
    """)
    List<IssueDTO> findByProjectId(int projectId);
}
