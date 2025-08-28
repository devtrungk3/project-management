package com.example.server.model.dto;

import com.example.server.model.entity.Role;
import com.example.server.model.entity.UserStatus;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Setter
@Getter
@AllArgsConstructor
public class UserDTO {
    private int id;
    private String username;
    private String fullname;
    private RoleDTO role;
    private UserStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
