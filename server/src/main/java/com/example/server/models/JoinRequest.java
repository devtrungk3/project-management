package com.example.server.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(uniqueConstraints = {
        @UniqueConstraint(columnNames = {"userId", "projectId"})
})
public class JoinRequest {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    @ManyToOne
    @JoinColumn(name = "userId")
    private User user;
    @ManyToOne
    @JoinColumn(name = "projectId")
    private Project project;
    private Boolean acceptFlag;
    @Column(insertable = false, updatable = false, columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
    private LocalDateTime createdAt;
    @UpdateTimestamp
    @Column(insertable = false, columnDefinition = "TIMESTAMP")
    private LocalDateTime updatedAt;
    public JoinRequest(int userId, int projectId) {
        this.user = new User();
        this.user.setId(userId);
        this.project = new Project();
        this.project.setId(projectId);
    }
}
