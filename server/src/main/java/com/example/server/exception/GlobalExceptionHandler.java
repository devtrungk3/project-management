package com.example.server.exception;

import io.jsonwebtoken.ExpiredJwtException;
import jakarta.validation.ConstraintViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.server.ServerErrorException;

import java.net.ConnectException;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(ServerErrorException.class)
    public ResponseEntity<Void> handleServerError(ServerErrorException e) {
        System.out.println("ServerErrorException - " + e.getMessage());
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
    }
    @ExceptionHandler(ConnectException.class)
    public ResponseEntity<Void> handleConnect(ConnectException e) {
        System.out.println("ConnectException - " + e.getMessage());
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
    }
    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<Map<String, String>> handleBadCredentials(BadCredentialsException e) {
        System.out.println("BadCredentialsException - " + e.getMessage());
        return new ResponseEntity<>(Map.of("error", "Incorrect username or password"), HttpStatus.UNAUTHORIZED);
    }
    @ExceptionHandler(ExpiredJwtException.class)
    public ResponseEntity<Map<String, String>> handleExpiredJwt(ExpiredJwtException e) {
        System.out.println("ExpiredJwtException - " + e.getMessage());
        return new ResponseEntity<>(Map.of("error", "Expired token"), HttpStatus.UNAUTHORIZED);
    }
    @ExceptionHandler(UsernameExistsException.class)
    public ResponseEntity<Map<String, String>> handleUsernameExists(UsernameExistsException e) {
        System.out.println("UsernameExistsException - " + e.getMessage());
        return new ResponseEntity<>(Map.of("error", "Username already exists"), HttpStatus.BAD_REQUEST);
    }
    @ExceptionHandler(RoleNotFoundException.class)
    public ResponseEntity<Void> handleRoleNotFound(RoleNotFoundException e) {
        System.out.println("RoleNotFoundException - " + e.getMessage());
        return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }
    @ExceptionHandler(ConstraintViolationException.class)
    public ResponseEntity<Map<String, String>> handleConstraintViolation(ConstraintViolationException e) {
        System.out.println("ConstraintViolationException - " + e.getMessage());
        String errorMessage = e.getConstraintViolations()
                .stream()
                .findFirst()
                .map(violation -> violation.getPropertyPath() + " " + violation.getMessage())
                .orElse("invalid account information");
        return new ResponseEntity<>(Map.of("error", errorMessage), HttpStatus.BAD_REQUEST);
    }
    @ExceptionHandler(IdNotFoundException.class)
    public ResponseEntity<Void> handleIdNotFound(IdNotFoundException e) {
        System.out.println("IdNotFoundException - " + e.getMessage());
        return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }
    @ExceptionHandler(ProjectNotFoundException.class)
    public ResponseEntity<Void> handleProjectNotFound(ProjectNotFoundException e) {
        System.out.println("ProjectNotFoundException - " + e.getMessage());
        return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }
}
