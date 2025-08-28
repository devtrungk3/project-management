package com.example.server.controller.user;

import com.example.server.service.domain.user.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController("UserControllerForUser")
@RequiredArgsConstructor
@RequestMapping("api/v1/user")
public class UserController {
    private final UserService userService;
    @GetMapping("/ok")
    public Map<String, String> index() {
        return Map.of("message", "Hello user");
    }

}
