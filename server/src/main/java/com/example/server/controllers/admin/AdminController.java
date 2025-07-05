package com.example.server.controllers;

import com.example.server.models.User;
import com.example.server.services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("api/v1/admin")
public class AdminController {
    private final UserService userService;
    @GetMapping("/ok")
    public Map<String, String> index() {
        return Map.of("message", "Hello admin");
    }

}
