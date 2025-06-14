package com.example.server.controllers;

import com.example.server.models.User;
import com.example.server.services.JWTService;
import com.example.server.services.UserService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("api/auth")
public class AuthController {
    private final UserService userService;
    private final JWTService jwtService;

    @PostMapping("/register")
    public User register(@RequestBody User user) {
        return userService.register(user);
    }

    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody User user, HttpServletResponse response) {
        List<String> tokens = userService.verify(user);
        if (tokens == null || tokens.size() != 2) return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed");

        Cookie cookie = new Cookie("refreshToken", tokens.get(1));
        cookie.setHttpOnly(true);
        cookie.setPath("/");
        cookie.setMaxAge(24 * 60 * 60);
        response.addCookie(cookie);

        return ResponseEntity.ok(tokens.get(0));
    }
    @PostMapping("/refresh-token")
    public ResponseEntity<String> refreshToken(@CookieValue(name = "refreshToken") String refreshToken) {
        if (jwtService.isValidRefreshToken(refreshToken)) {
            String username = jwtService.extractUsername(refreshToken);
            return ResponseEntity.ok(jwtService.generateAccessToken(username));
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Refresh token failed");
    }
    @PostMapping("revoke-refresh-token")
    public ResponseEntity<String> revokeRefreshToken(@CookieValue(name = "refreshToken") String refreshToken) {
        if (jwtService.isValidRefreshToken(refreshToken)) {
            String username = jwtService.extractUsername(refreshToken);
            jwtService.revokeRefreshToken(username);
            return ResponseEntity.ok("Revoke successfully");
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Revoke token failed");
    }
}