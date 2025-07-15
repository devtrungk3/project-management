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
        return userRepository.findById(id).orElseThrow(() -> new IdNotFoundException("UserId " + id + " not found"));
    }

    @Override
    public User register(User newUser) {
        if (userRepository.existsByUsername(newUser.getUsername())) {
            throw new UsernameExistsException("Username " + newUser.getUsername() + " already exists");
        }
        Role role = roleRepository.findByName("USER")
                .orElseThrow(() -> new RoleNotFoundException("Role USER does not exists"));
        newUser.setId(0);
        newUser.setRole(role);
        if (newUser.getPassword() != null) {
            newUser.setPassword(encoder.encode(newUser.getPassword()));
        }
        return userRepository.save(newUser);
    }
    
    @Override
    public List<String> verify(User userCredentialRequest) {
        Authentication authentication =
                authManager.authenticate(new UsernamePasswordAuthenticationToken(userCredentialRequest.getUsername(), userCredentialRequest.getPassword()));
        if (!authentication.isAuthenticated()) return null;

        User userInDB = userRepository.findByUsername(userCredentialRequest.getUsername())
                .orElseThrow(() -> new BadCredentialsException("Username  " + userCredentialRequest.getUsername() + " not found"));
        String newAccessToken = jwtService.generateAccessToken(userInDB.getId(), userInDB.getUsername(), userInDB.getRole().getName());
        String newRefreshToken = jwtService.generateRefreshToken(userInDB.getId(), userInDB.getUsername(), userInDB.getRole().getName());
        jwtService.saveRefreshToken(userInDB.getId(), newRefreshToken);
        return Arrays.asList(newAccessToken, newRefreshToken);
    }

    @Override
    public User updateUserById(int id, User updatedUser) {
        return null;
    }

    @Override
    public void deleteUserById(int id) {
        if (userRepository.existsById(id)) userRepository.deleteById(id);
        else throw new IdNotFoundException("UserId " + id + " not found");
    }
}
