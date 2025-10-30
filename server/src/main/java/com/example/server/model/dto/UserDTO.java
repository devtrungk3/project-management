package com.example.server.model.dto;

import com.example.server.model.enums.UserStatus;
import lombok.*;

import java.time.LocalDateTime;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class UserDTO {
    private int id;
    private String username;
    private String fullname;
    private RoleDTO role;
    private UserStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
