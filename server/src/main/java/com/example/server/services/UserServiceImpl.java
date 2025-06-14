package com.example.server.services;

import com.example.server.models.User;
import com.example.server.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService{
    private final UserRepository userRepository;
    private final AuthenticationManager authManager;
    private final JWTService jwtService;
    private BCryptPasswordEncoder encoder = new BCryptPasswordEncoder(10);

    @Override
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @Override
    public User getUserById(int id) {
        return userRepository.findById(id).orElseThrow(() -> new RuntimeException("User id " + id + " not found"));
    }

    @Override
    public User register(User user) {
        if (userRepository.findByUsername(user.getUsername()).isPresent())
            throw new RuntimeException("Username " + user.getUsername() + " already exists");
        user.setPassword(encoder.encode(user.getPassword()));
        return userRepository.save(user);
    }

    @Override
    public List<String> verify(User user) {
        Authentication authentication =
                authManager.authenticate(new UsernamePasswordAuthenticationToken(user.getUsername(), user.getPassword()));
        if (authentication.isAuthenticated()) {
            String accessToken = jwtService.generateAccessToken(user.getUsername());
            String refreshToken = jwtService.generateRefreshToken(user.getUsername());
            jwtService.saveRefreshToken(user.getUsername(), refreshToken);
            return Arrays.asList(accessToken, refreshToken);
        }
        return null;
    }

    @Override
    public User updateUser(int id, User newUser) {
        User user = userRepository.findById(id).orElseThrow(() -> new RuntimeException("User id " + id + " not found"));
        user.setFullname(newUser.getFullname());
        user.setRole(newUser.getRole());
        return userRepository.save(user);
    }

    @Override
    public void deleteUser(int id) {
        userRepository.findById(id).orElseThrow(() -> new RuntimeException("User id " + id + " not found"));
        userRepository.deleteById(id);
    }

}
