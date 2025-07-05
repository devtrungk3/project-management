package com.example.server.services;

import com.example.server.exception.IdNotFoundException;
import com.example.server.exception.RoleNotFoundException;
import com.example.server.exception.UsernameExistsException;
import com.example.server.models.Role;
import com.example.server.models.User;
import com.example.server.repositories.RoleRepository;
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
    private final RoleRepository roleRepository;
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
    public void register(User user) {
        if (userRepository.findByUsername(user.getUsername()).isPresent())
            throw new UsernameExistsException("Username " + user.getUsername() + " already exists");
        Role role = roleRepository.findByName("USER").orElse(null);
        if (role == null)
            throw new RoleNotFoundException("Role USER does not exists");
        user.setRole(role);
        if (user.getPassword() != null)
            user.setPassword(encoder.encode(user.getPassword()));
        userRepository.save(user);
    }
    
    @Override
    public List<String> verify(User user) {
        Authentication authentication =
                authManager.authenticate(new UsernamePasswordAuthenticationToken(user.getUsername(), user.getPassword()));
        if (authentication.isAuthenticated()) {
            User userInfo = userRepository.findByUsername(user.getUsername())
                    .orElseThrow(() -> new BadCredentialsException("Username  " + user.getUsername() + " not found"));
            String accessToken = jwtService.generateAccessToken(userInfo.getId(), userInfo.getUsername(), userInfo.getRole().getName());
            String refreshToken = jwtService.generateRefreshToken(userInfo.getId(), userInfo.getUsername(), userInfo.getRole().getName());
            jwtService.saveRefreshToken(userInfo.getId(), refreshToken);
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
