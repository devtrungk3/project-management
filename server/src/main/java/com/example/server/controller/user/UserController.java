package com.example.server.controller.user;

import com.example.server.model.dto.ChangePasswordRequest;
import com.example.server.service.domain.user.UserService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController("UserControllerForUser")
@RequiredArgsConstructor
@RequestMapping("api/v1/user")
public class UserController {
    private final UserService userService;
    @PutMapping("/password")
    public ResponseEntity<Void> changePassword(
        HttpServletRequest request,
        @Valid @RequestBody ChangePasswordRequest changePasswordRequest
    ) {
        int userIdExtractedFromJWT = (int) request.getAttribute("userId");
        userService.changePassword(userIdExtractedFromJWT, changePasswordRequest.getCurrentPassword(), changePasswordRequest.getNewPassword());
        return ResponseEntity.noContent().build();
    }
}
