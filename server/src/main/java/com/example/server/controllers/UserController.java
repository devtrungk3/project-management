package com.example.server.controllers;

import com.example.server.models.User;
import com.example.server.services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("api/v1/user")
public class UserController {
    private final UserService userService;
    @GetMapping("/ok")
    public Map<String, String> index() {
        return Map.of("message", "Hello user");
    }

}
