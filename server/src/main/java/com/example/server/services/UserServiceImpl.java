package com.example.server.services;

import com.example.server.exception.IdNotFoundException;
import com.example.server.exception.UsernameExistsException;
import com.example.server.models.User;
import com.example.server.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
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
        return userRepository.findById(id).orElseThrow(() -> new IdNotFoundException("User id " + id + " not found"));
    }

    @Override
    public boolean register(User user) {
        if (userRepository.findByUsername(user.getUsername()).isPresent())
            throw new UsernameExistsException("Username " + user.getUsername() + " already exists");
        if (user.getPassword() != null)
            user.setPassword(encoder.encode(user.getPassword()));
        userRepository.save(user);
        return true;
    }
    
    @Override
    public List<String> verify(User user) {
        Authentication authentication =
                authManager.authenticate(new UsernamePasswordAuthenticationToken(user.getUsername(), user.getPassword()));
        if (authentication.isAuthenticated()) {
            User userInfo = userRepository.findByUsername(user.getUsername())
                    .orElseThrow(() -> new BadCredentialsException("User: Username  " + user.getUsername() + " not found"));
            String accessToken = jwtService.generateAccessToken(user.getUsername(), userInfo.getRole().getName());
            String refreshToken = jwtService.generateRefreshToken(user.getUsername(), userInfo.getRole().getName());
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
