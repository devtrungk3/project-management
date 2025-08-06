package com.example.server.service.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

@Service
public class JWTService {
    @Value("${jwt.secret}")
    private String secretKey;
    private final Map<Integer, String> refreshTokenStore = new HashMap<>();  // In-memory (RAM) store

    public String generateAccessToken(int userId, String username, String userRole) {
        int minutes = 15;
        Map<String, Object> claims = new HashMap<>();
        claims.put("username", username);
        claims.put("role", userRole);

        return Jwts.builder()
                .claims()
                .add(claims)
                .subject(String.valueOf(userId))
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis() + 1000 * 60 * minutes))
                .and()
                .signWith(getKey())
                .compact();
    }

    public String generateRefreshToken(int userId, String username, String userRole) {
        int hours = 24;
        Map<String, Object> claims = new HashMap<>();
        claims.put("type", "refresh");
        claims.put("username", username);
        claims.put("role", userRole);

        return Jwts.builder()
                .claims()
                .add(claims)
                .subject(String.valueOf(userId))
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60 * hours))
                .and()
                .signWith(getKey())
                .compact();
    }
    public void saveRefreshToken(int userId, String refreshToken) {
        refreshTokenStore.put(userId, refreshToken);
    }
    public void revokeRefreshToken(int userId) {
        refreshTokenStore.remove(userId);
    }
    private SecretKey getKey() {
        byte[] keyBytes = Decoders.BASE64.decode(secretKey);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    public int extractUserId(String token) {
        return Integer.parseInt(extractClaim(token, Claims::getSubject));
    }
    public String extractUsername(String token) {
        return extractClaim(token, claims -> claims.get("username", String.class));
    }
    public String extractTokenType(String token) {
        return extractClaim(token, claims -> claims.get("type", String.class));
    }
    public String extractUserRole(String token) {
        return extractClaim(token, claims -> claims.get("role", String.class));
    }
    private <T> T extractClaim(String token, Function<Claims, T> claimResolver) {
        Claims claims = extractAllClaims(token);
        return claimResolver.apply(claims);
    }
    private Claims extractAllClaims(String token) {
        return Jwts.parser()
                .verifyWith(getKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    public boolean isValidAccessToken(String token, UserDetails userDetails) {
        String username = extractUsername(token);
        return (username.equals(userDetails.getUsername()));
    }
    public boolean isValidRefreshToken(String token) {
        int userId = extractUserId(token);
        String tokenType = extractTokenType(token);
        return refreshTokenStore.get(userId) != null && refreshTokenStore.get(userId).equals(token) && tokenType.equals("refresh");
    }
}
