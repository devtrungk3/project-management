package com.example.server.services;

import com.example.server.models.User;

import java.util.List;
import java.util.Optional;

public interface UserService {
    List<User> getAllUsers();
    User getUserById(int id);
    User register(User user);
    List<String> verify(User user);
    User updateUser(int id, User user);
    void deleteUser(int id);
}
