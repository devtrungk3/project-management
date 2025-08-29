package com.example.server.controller.admin;

import com.example.server.model.dto.UserDTO;
import com.example.server.model.entity.User;
import com.example.server.service.domain.user.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController("UserControllerForAdmin")
@RequiredArgsConstructor
@RequestMapping("api/v1/admin/users")
public class UserController {
    private final UserService userService;
    @GetMapping
    public ResponseEntity<Page<UserDTO>> getAllUsers(@RequestParam int page) {
        return ResponseEntity.ok(userService.getAllUsers(page, 10));
    }
    @PostMapping
    public ResponseEntity<Void> addNewUser(@RequestBody User newUser) {
        userService.register(newUser);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable(name = "id") int deletedUserId) {
        userService.deleteUserById(deletedUserId);
        return ResponseEntity.noContent().build();
    }
    @PatchMapping("/{id}/active")
    public ResponseEntity<UserDTO> activeUser(@PathVariable(name = "id") int activatedUserId) {
        return ResponseEntity.ok(userService.activeUser(activatedUserId));
    }
    @PatchMapping("/{id}/suspend")
    public ResponseEntity<UserDTO> suspendUser(@PathVariable(name = "id") int suspendedUserId) {
        return ResponseEntity.ok(userService.suspendUser(suspendedUserId));
    }
    @PatchMapping("/{id}/ban")
    public ResponseEntity<UserDTO> banUser(@PathVariable(name = "id") int bannedUserId) {
        return ResponseEntity.ok(userService.banUser(bannedUserId));
    }
}