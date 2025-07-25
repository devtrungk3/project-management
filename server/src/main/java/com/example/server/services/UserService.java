package com.example.server.services;

import com.example.server.models.User;

import java.util.List;

public interface UserService {
    List<User> getAllUsers();
    User getUserById(int id);
    User register(User newUser);
    List<String> verify(User userCredentialRequest);
    User updateUserById(int id, User updatedUser);
    void deleteUserById(int id);
}
