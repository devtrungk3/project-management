package com.example.server.services;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
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
    private final Map<String, String> refreshTokenStore = new HashMap<>();  // In-memory (RAM) store

    public String generateAccessToken(String username) {
        int minutes = 5;
        Map<String, Object> claims = new HashMap<>();

        return Jwts.builder()
                .claims()
                .add(claims)
                .subject(username)
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis() + 1000 * 60 * minutes))
                .and()
                .signWith(getKey())
                .compact();
    }

    public String generateRefreshToken(String username) {

        int hours = 24;
        Map<String, Object> claims = new HashMap<>();
        claims.put("type", "refresh");

        return Jwts.builder()
                .claims()
                .add(claims)
                .subject(username)
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60 * hours))
                .and()
                .signWith(getKey())
                .compact();
    }
    public void saveRefreshToken(String username, String refreshToken) {
        refreshTokenStore.put(username, refreshToken);
    }
    public void revokeRefreshToken(String username) {
        refreshTokenStore.remove(username);
    }
    private SecretKey getKey() {
        byte[] keyBytes = Decoders.BASE64.decode(secretKey);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }
    public String extractTokenType(String token) {
        return extractClaim(token, claims -> claims.get("type", String.class));
    }

    private <T> T extractClaim(String token, Function<Claims, T> claimResolver) {
        try {
            final Claims claims = extractAllClaims(token);
            return claimResolver.apply(claims);
        } catch (ExpiredJwtException e) {
            System.out.println(e.getMessage());
        }
        return null;
    }
    private Claims extractAllClaims(String token) {
        return Jwts.parser()
                .verifyWith(getKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    public boolean isValidAccessToken(String token, UserDetails userDetails) {
        final String username = extractUsername(token);
        return (username.equals(userDetails.getUsername()));
    }
    public boolean isValidRefreshToken(String token) {
        final String username = extractUsername(token);
        final String type = extractTokenType(token);
        return refreshTokenStore.get(username) != null && refreshTokenStore.get(username).equals(token) && type.equals("refresh");
    }
}
