package com.example.server.repository;

import com.example.server.model.entity.IssueComment;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.repository.CrudRepository;

import java.util.List;
import java.util.Optional;

public interface IssueCommentRepository extends CrudRepository<IssueComment, Integer> {
    @EntityGraph(attributePaths = {"author"})
    List<IssueComment> findByIssue_Id(int issueId);

    Optional<IssueComment> findByIdAndAuthor_Id(int id, int userId);
}
