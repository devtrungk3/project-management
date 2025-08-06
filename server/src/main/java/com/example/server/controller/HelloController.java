package com.example.server.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.Map;

@RestController
@RequestMapping("api/v1")
public class HelloController {
    @GetMapping("/helloworld")
    public Map<String, String> index() {
        return Map.of("message", "hello world");
    }
}
