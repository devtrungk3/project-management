package com.example.server.service.security;

import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.Bucket;
import io.github.bucket4j.Refill;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class RateLimitService {
    private final Map<String, Bucket> bucketCache = new ConcurrentHashMap<>();
    public Bucket getBucket(String userIpAddress, String bucketType) {
        String key = userIpAddress + "|" + bucketType;
        return bucketCache.computeIfAbsent(key, k -> createBucket(bucketType));
    }

    private Bucket createBucket(String bucketType) {
        switch (bucketType) {
            case "LOGIN":
                return Bucket.builder()
                        .addLimit(Bandwidth.classic(
                                3, Refill.greedy(3, Duration.ofSeconds(15))))
                        .build();
            default:
                return Bucket.builder()
                        .addLimit(Bandwidth.classic(
                                20, Refill.greedy(20, Duration.ofSeconds(10))))
                        .build();
        }
    }
}
