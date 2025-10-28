package com.example.server.service.security;

import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
public class RefreshTokenService {
    private static final String TOKEN_PREFIX = "refresh_token:";
    private static final long TOKEN_EXPIRATION_HOURS = 24;

    private final RedisTemplate<String, String> redisTemplate;
    public void storeToken(Integer userId, String refreshToken) {
        String key = TOKEN_PREFIX + userId;
        redisTemplate.opsForValue().set(key, refreshToken, TOKEN_EXPIRATION_HOURS, TimeUnit.HOURS);
    }
    public String getToken(Integer userId) {
        String key = TOKEN_PREFIX + userId;
        return redisTemplate.opsForValue().get(key);
    }
    public void removeToken(Integer userId) {
        String key = TOKEN_PREFIX + userId;
        redisTemplate.delete(key);
    }
    public boolean hasToken(Integer userId) {
        String key = TOKEN_PREFIX + userId;
        return Boolean.TRUE.equals(redisTemplate.hasKey(key));
    }
}
