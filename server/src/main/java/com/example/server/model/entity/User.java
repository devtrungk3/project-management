package com.example.server.model.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
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
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    @NotNull
    @Pattern(regexp = "^[a-zA-Z][a-zA-Z0-9]{2,254}$",
            message = "must be 3-255 alphanumeric characters")
    @Column(unique = true)
    private String username;
    @NotNull
    private String password;
    @NotNull
    private String fullname;
    @ManyToOne(fetch = FetchType.LAZY)
    @NotNull
    @JoinColumn(name = "roleId")
    private Role role;
    @NotNull
    @Enumerated(EnumType.STRING)
    private UserStatus status = UserStatus.ACTIVE;
    @Column(insertable = false, updatable = false, columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
    private LocalDateTime createdAt;
    @UpdateTimestamp
    @Column(insertable = false, columnDefinition = "TIMESTAMP")
    private LocalDateTime updatedAt;
}
