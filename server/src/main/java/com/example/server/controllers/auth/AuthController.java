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
    public ResponseEntity<Void> register(@RequestBody User user) {
        userService.register(user);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody User user, HttpServletResponse response) {
        List<String> tokens = userService.verify(user);
        if (tokens == null || tokens.size() != 2) throw new BadCredentialsException("Login failed: cannot create tokens");

        Cookie cookie = new Cookie("refreshToken", tokens.get(1));
        cookie.setHttpOnly(true);
        cookie.setPath("/");
        cookie.setMaxAge(24 * 60 * 60);
        response.addCookie(cookie);

        return ResponseEntity.ok(tokens.get(0));
    }
    @PostMapping("/refresh-token")
    public ResponseEntity<?> refreshToken(@CookieValue(name = "refreshToken") String refreshToken) {
        if (jwtService.isValidRefreshToken(refreshToken)) {
            int id = jwtService.extractUserId(refreshToken);
            String username = jwtService.extractUsername(refreshToken);
            String role = jwtService.extractTokenRole(refreshToken);
            return ResponseEntity.ok(jwtService.generateAccessToken(id, username, role));
        }
        return new ResponseEntity<>(Map.of("error", "Refresh token failed"), HttpStatus.UNAUTHORIZED);
    }
    @PostMapping("revoke-refresh-token")
    public ResponseEntity<?> revokeRefreshToken(@CookieValue(name = "refreshToken") String refreshToken) {
        if (jwtService.isValidRefreshToken(refreshToken)) {
            int id = jwtService.extractUserId(refreshToken);
            jwtService.revokeRefreshToken(id);
            return ResponseEntity.ok().build();
        }
        return new ResponseEntity<>(Map.of("error", "Revoke token failed"), HttpStatus.UNAUTHORIZED);
    }
}