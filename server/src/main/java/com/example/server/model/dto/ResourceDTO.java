package com.example.server.model.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serial;
import java.io.Serializable;
import java.time.LocalDateTime;

@Setter
@Getter
@NoArgsConstructor
public class ResourceDTO implements Serializable {
    @Serial
    private static final long serialVersionUID = 1L;
    private int id;
    private String username;
    private LocalDateTime createdAt;

    public ResourceDTO(int id, String username, LocalDateTime createdAt) {
        this.id = id;
        this.username = username;
        this.createdAt = createdAt;
    }
}
