package com.example.server.controller.auth;

import com.example.server.exception.TooManyRequestException;
import com.example.server.model.entity.User;
import com.example.server.service.security.JWTService;
import com.example.server.service.domain.user.UserService;
import com.example.server.service.security.RateLimitService;
import io.github.bucket4j.Bucket;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.web.csrf.CsrfToken;
import org.springframework.web.bind.annotation.*;

import java.time.Duration;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("api/v1/auth")
public class AuthController {
    private final UserService userService;
    private final JWTService jwtService;
    private final RateLimitService rateLimitService;

    @PostMapping("/register")
    public ResponseEntity<Void> register(@RequestBody User newUser) {
        userService.register(newUser);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @GetMapping("/csrf-token")
    public ResponseEntity<?> getCsrfToken(HttpServletRequest request) {
        CsrfToken csrfToken = (CsrfToken) request.getAttribute(CsrfToken.class.getName());

        Map<String, String> tokenMap = new HashMap<>();
        tokenMap.put("headerName", csrfToken.getHeaderName());
        tokenMap.put("token", csrfToken.getToken());
        return ResponseEntity.ok(tokenMap);
    }

    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody User userCredentialRequest, HttpServletRequest request, HttpServletResponse response) {
        String ipAddress = request.getRemoteAddr();
        Bucket loginBucket = rateLimitService.getBucket(ipAddress, "LOGIN");
        if (!loginBucket.tryConsume(1)) {
            throw new TooManyRequestException("Too many login request from IP: " + ipAddress, ipAddress);
        }
        List<String> newTokens = userService.verify(userCredentialRequest);
        if (newTokens == null || newTokens.size() != 2) throw new BadCredentialsException("Login failed: cannot create tokens");
        String newAccessToken = newTokens.get(0);
        String newRefreshToken = newTokens.get(1);

        ResponseCookie cookie = ResponseCookie.from("refreshToken", newRefreshToken)
                .httpOnly(true)
                .secure(true)
                .path("/")
                .maxAge(Duration.ofDays(1))
                .sameSite("Strict")
                .build();
        response.addHeader("Set-Cookie", cookie.toString());

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