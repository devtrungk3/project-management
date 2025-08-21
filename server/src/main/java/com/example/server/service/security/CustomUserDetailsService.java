package com.example.server.service.security;

import com.example.server.exception.InactiveUserException;
import com.example.server.model.entity.User;
import com.example.server.model.entity.UserPrincipal;
import com.example.server.model.entity.UserStatus;
import com.example.server.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findByUsername(username).orElseThrow(() -> new UsernameNotFoundException("Username " + username + " not found"));
        if (user.getStatus() != UserStatus.ACTIVE) {
            throw new InactiveUserException(user.getStatus(), "User with username:" + user.getUsername() + " has been " + user.getStatus());
        }
        return new UserPrincipal(user);
    }
}
