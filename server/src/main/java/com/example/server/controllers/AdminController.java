package com.example.server.controllers;

import com.example.server.models.User;
import com.example.server.services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("api/admin")
public class AdminController {
    private final UserService userService;
    @GetMapping("/ok")
    public String index() {
        return "Hello admin";
    }

}
