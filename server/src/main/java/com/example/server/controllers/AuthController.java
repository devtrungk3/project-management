package com.example.server.controllers;

import com.example.server.models.User;
import com.example.server.services.JWTService;
import com.example.server.services.UserService;
import io.jsonwebtoken.ExpiredJwtException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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
    public User register(@RequestBody User user) {
        return userService.register(user);
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> login(@RequestBody User user, HttpServletResponse response) {
        List<String> tokens = userService.verify(user);
        if (tokens == null || tokens.size() != 2) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Incorrect username or password"));

        Cookie cookie = new Cookie("refreshToken", tokens.get(1));
        cookie.setHttpOnly(true);
        cookie.setPath("/");
        cookie.setMaxAge(24 * 60 * 60);
        response.addCookie(cookie);

        return ResponseEntity.ok(Map.of("accessToken", tokens.get(0)));
    }
    @PostMapping("/refresh-token")
    public ResponseEntity<Map<String, String>> refreshToken(@CookieValue(name = "refreshToken") String refreshToken) {
        try {
            if (jwtService.isValidRefreshToken(refreshToken)) {
                String username = jwtService.extractUsername(refreshToken);
                String role = jwtService.extractTokenRole(refreshToken);
                return ResponseEntity.ok(Map.of("accessToken", jwtService.generateAccessToken(username, role)));
            }
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", "Refresh token failed"));
        } catch (ExpiredJwtException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Expired token"));
        }
    }
    @PostMapping("revoke-refresh-token")
    public ResponseEntity<Map<String, String>> revokeRefreshToken(@CookieValue(name = "refreshToken") String refreshToken) {
        try {
            if (jwtService.isValidRefreshToken(refreshToken)) {
                String username = jwtService.extractUsername(refreshToken);
                jwtService.revokeRefreshToken(username);
                return ResponseEntity.ok(Map.of("message", "Revoke successfully"));
            }
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", "Revoke token failed"));
        } catch (ExpiredJwtException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Expired token"));
        }
    }
}