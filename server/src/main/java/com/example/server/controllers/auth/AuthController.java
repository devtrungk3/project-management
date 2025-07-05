package com.example.server.controllers;

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
    public ResponseEntity<Map<String, String>> register(@RequestBody User user) {
        if (userService.register(user))
            return new ResponseEntity<>(Map.of("message", "Create new account successfully"), HttpStatus.CREATED);
        return new ResponseEntity<>(Map.of("error", "Register failed"), HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> login(@RequestBody User user, HttpServletResponse response) {
        List<String> tokens = userService.verify(user);
        if (tokens == null || tokens.size() != 2) throw new BadCredentialsException("Login failed: cannot create tokens");

        Cookie cookie = new Cookie("refreshToken", tokens.get(1));
        cookie.setHttpOnly(true);
        cookie.setPath("/");
        cookie.setMaxAge(24 * 60 * 60);
        response.addCookie(cookie);

        return ResponseEntity.ok(Map.of("accessToken", tokens.get(0)));
    }
    @PostMapping("/refresh-token")
    public ResponseEntity<Map<String, String>> refreshToken(@CookieValue(name = "refreshToken") String refreshToken) {
        if (jwtService.isValidRefreshToken(refreshToken)) {
            String username = jwtService.extractUsername(refreshToken);
            String role = jwtService.extractTokenRole(refreshToken);
            return ResponseEntity.ok(Map.of("accessToken", jwtService.generateAccessToken(username, role)));
        }
        return new ResponseEntity<>(Map.of("error", "Refresh token failed"), HttpStatus.BAD_REQUEST);
    }
    @PostMapping("revoke-refresh-token")
    public ResponseEntity<Map<String, String>> revokeRefreshToken(@CookieValue(name = "refreshToken") String refreshToken) {
        if (jwtService.isValidRefreshToken(refreshToken)) {
            String username = jwtService.extractUsername(refreshToken);
            jwtService.revokeRefreshToken(username);
            return ResponseEntity.ok(Map.of("message", "Revoke successfully"));
        }
        return new ResponseEntity<>(Map.of("error", "Revoke token failed"), HttpStatus.BAD_REQUEST);
    }
}