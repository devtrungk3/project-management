package com.example.server.controllers.auth;

import com.example.server.models.User;
import com.example.server.services.JWTService;
import com.example.server.services.UserService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("api/v1/auth")
public class AuthController {
    private final UserService userService;
    private final JWTService jwtService;

    @PostMapping("/register")
    public ResponseEntity<Void> register(@RequestBody User newUser) {
        userService.register(newUser);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody User userCredentialRequest, HttpServletResponse response) {
        List<String> newTokens = userService.verify(userCredentialRequest);
        if (newTokens == null || newTokens.size() != 2) throw new BadCredentialsException("Login failed: cannot create tokens");
        String newAccessToken = newTokens.get(0);
        String newRefreshToken = newTokens.get(1);
        Cookie cookie = new Cookie("refreshToken", newRefreshToken);
        cookie.setHttpOnly(true);
        cookie.setPath("/");
        cookie.setMaxAge(24 * 60 * 60);
        response.addCookie(cookie);
        return ResponseEntity.ok(newAccessToken);
    }
    @PostMapping("/refresh-token")
    public ResponseEntity<?> refreshToken(@CookieValue(name = "refreshToken") String refreshToken) {
        if (!jwtService.isValidRefreshToken(refreshToken))
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Refresh token failed"));

        int userId = jwtService.extractUserId(refreshToken);
        String username = jwtService.extractUsername(refreshToken);
        String userRole = jwtService.extractUserRole(refreshToken);
        String newAccessToken = jwtService.generateAccessToken(userId, username, userRole);
        return ResponseEntity.ok().body(newAccessToken);
    }
    @PostMapping("revoke-refresh-token")
    public ResponseEntity<?> revokeRefreshToken(@CookieValue(name = "refreshToken") String refreshToken) {
        if (!jwtService.isValidRefreshToken(refreshToken))
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Revoke token failed"));

        int userId = jwtService.extractUserId(refreshToken);
        jwtService.revokeRefreshToken(userId);
        return ResponseEntity.noContent().build();
    }
}