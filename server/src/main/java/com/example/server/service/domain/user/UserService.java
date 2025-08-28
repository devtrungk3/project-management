package com.example.server.service.domain.user;

import com.example.server.model.dto.UserDTO;
import com.example.server.model.entity.User;
import org.springframework.data.domain.Page;

import java.util.List;

public interface UserService {
    Page<UserDTO> getAllUsers(int pageNumber, int pageSize);
    User getUserById(int id);
    User register(User newUser);
    List<String> verify(User userCredentialRequest);
    User updateUserById(int id, User updatedUser);
    void deleteUserById(int id);
    UserDTO activeUser(int userId);
    UserDTO suspendUser(int userId);
    UserDTO banUser(int userId);
}
