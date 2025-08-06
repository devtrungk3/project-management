package com.example.server.controller.admin;

import com.example.server.service.domain.user.UserService;
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
