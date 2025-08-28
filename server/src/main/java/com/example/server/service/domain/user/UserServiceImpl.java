package com.example.server.service.domain.user;

import com.example.server.exception.IdNotFoundException;
import com.example.server.exception.RoleNotFoundException;
import com.example.server.exception.UsernameExistsException;
import com.example.server.model.dto.RoleDTO;
import com.example.server.model.dto.UserDTO;
import com.example.server.model.entity.Role;
import com.example.server.model.entity.User;
import com.example.server.model.entity.UserStatus;
import com.example.server.repository.RoleRepository;
import com.example.server.repository.UserRepository;
import com.example.server.service.security.JWTService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
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
    public Page<UserDTO> getAllUsers(int pageNumber, int pageSize) {
        Page<User> users = userRepository.findByRole_NameNotOrderByCreatedAtDesc("ADMIN", PageRequest.of(pageNumber, pageSize));
        return users.map(user -> new UserDTO(
                user.getId(),
                user.getUsername(),
                user.getFullname(),
                new RoleDTO(user.getRole().getId(), user.getRole().getName()),
                user.getStatus(),
                user.getCreatedAt(),
                user.getUpdatedAt()
        ));
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

    @Override
    public UserDTO activeUser(int userId) {
        User oldUser = userRepository.findById(userId).orElse(null);
        if (oldUser != null) {
            oldUser.setStatus(UserStatus.ACTIVE);
            userRepository.save(oldUser);
            return new UserDTO(
                    oldUser.getId(),
                    oldUser.getUsername(),
                    oldUser.getFullname(),
                    new RoleDTO(oldUser.getRole().getId(), oldUser.getRole().getName()),
                    oldUser.getStatus(),
                    oldUser.getCreatedAt(),
                    oldUser.getUpdatedAt()
            );
        } else throw new IdNotFoundException("UserId " + userId + " not found");
    }

    @Override
    public UserDTO suspendUser(int userId) {
        User oldUser = userRepository.findById(userId).orElse(null);
        if (oldUser != null) {
            oldUser.setStatus(UserStatus.SUSPENDED);
            userRepository.save(oldUser);
            return new UserDTO(
                    oldUser.getId(),
                    oldUser.getUsername(),
                    oldUser.getFullname(),
                    new RoleDTO(oldUser.getRole().getId(), oldUser.getRole().getName()),
                    oldUser.getStatus(),
                    oldUser.getCreatedAt(),
                    oldUser.getUpdatedAt()
            );
        } else throw new IdNotFoundException("UserId " + userId + " not found");
    }

    @Override
    public UserDTO banUser(int userId) {
        User oldUser = userRepository.findById(userId).orElse(null);
        if (oldUser != null) {
            oldUser.setStatus(UserStatus.BANNED);
            userRepository.save(oldUser);
            return new UserDTO(
                    oldUser.getId(),
                    oldUser.getUsername(),
                    oldUser.getFullname(),
                    new RoleDTO(oldUser.getRole().getId(), oldUser.getRole().getName()),
                    oldUser.getStatus(),
                    oldUser.getCreatedAt(),
                    oldUser.getUpdatedAt()
            );
        } else throw new IdNotFoundException("UserId " + userId + " not found");
    }
}
