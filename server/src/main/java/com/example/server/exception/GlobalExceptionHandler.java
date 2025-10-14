package com.example.server.exception;

import com.example.server.model.entity.UserStatus;
import jakarta.validation.ConstraintViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
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
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Incorrect username or password"));
    }
    @ExceptionHandler(InactiveUserException.class)
    public ResponseEntity<Map<String, String>> handleInactiveUser(InactiveUserException e) {
        System.out.println("InactiveUserException - " + e.getMessage());
        String errorMessage = e.getUserStatus() == UserStatus.SUSPENDED
                ? "Your account has been suspended. Please contact support for details"
                : "Your account has been permanently banned due to violations of our terms of service";
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", errorMessage));
    }
    @ExceptionHandler(UsernameExistsException.class)
    public ResponseEntity<Map<String, String>> handleUsernameExists(UsernameExistsException e) {
        System.out.println("UsernameExistsException - " + e.getMessage());
        return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("error", "Username already exists"));
    }
    @ExceptionHandler(ConstraintViolationException.class)
    public ResponseEntity<Map<String, String>> handleConstraintViolation(ConstraintViolationException e) {
        System.out.println("ConstraintViolationException - " + e.getMessage());
        String errorMessage = e.getConstraintViolations()
                .stream()
                .findFirst()
                .map(violation -> violation.getPropertyPath() + " " + violation.getMessage())
                .orElse("invalid account information");
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", errorMessage));
    }
    @ExceptionHandler(IdNotFoundException.class)
    public ResponseEntity<Map<String, String>> handleIdNotFound(IdNotFoundException e) {
        System.out.println("IdNotFoundException - " + e.getMessage());
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "Resource not found"));
    }
    @ExceptionHandler(EntityNotFoundException.class)
    public ResponseEntity<Map<String, String>> handleEntityNotFound(EntityNotFoundException e) {
        System.out.println("EntityNotFoundException - " + e.getMessage());
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "Resource not found"));
    }
    @ExceptionHandler(JoinRequestExistsException.class)
    public ResponseEntity<Map<String, String>> handleJoinRequestExists(JoinRequestExistsException e) {
        System.out.println("JoinRequestExistsException - " + e.getMessage());
        return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("error", "This join request already exists"));
    }
    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<Void> handleHttpMessageNotReadable(HttpMessageNotReadableException e) {
        System.out.println("HttpMessageNotReadableException - " + e.getMessage());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
    }
    @ExceptionHandler(SelfJoinRequestNotAllowException.class)
    public ResponseEntity<Map<String, String>> handleSelfJoinRequestNotAllow(SelfJoinRequestNotAllowException e) {
        System.out.println("SelfJoinRequestNotAllowException - " + e.getMessage());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", "Cannot send join request to yourself"));
    }
    @ExceptionHandler(ResourceExistsException.class)
    public ResponseEntity<Map<String, String>> handleResourceExists(ResourceExistsException e) {
        System.out.println("ResourceExistsException - " + e.getMessage());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", "Already join in this project"));
    }
    @ExceptionHandler(InvalidJoinRequestException.class)
    public ResponseEntity<Map<String, String>> handleInvalidJoinRequest(InvalidJoinRequestException e) {
        System.out.println("InvalidJoinRequestException - " + e.getMessage());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
    }
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<Map<String, String>> handleIllegalArgument(IllegalArgumentException e) {
        System.out.println("IllegalArgumentException - " + e.getMessage());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", e.getMessage()));
    }
    @ExceptionHandler(ProjectNotInProgressException.class)
    public ResponseEntity<Map<String, String>> handleProjectNotInProgress(ProjectNotInProgressException e) {
        System.out.println("ProjectNotInProgressException - " + e.getMessage());
        return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("error", "Cannot update task completion when project is not in progress"));
    }
    @ExceptionHandler(TooManyRequestException.class)
    public ResponseEntity<Map<String, String>> handleTooManyRequest(TooManyRequestException e) {
        System.out.println("TooManyRequestException - " + e.getMessage());
        return ResponseEntity.status(HttpStatus.TOO_MANY_REQUESTS).body(Map.of("error", "Too many request"));
    }
    @ExceptionHandler(InvalidProjectStateException.class)
    public ResponseEntity<Map<String, String>> handleInvalidProjectState(InvalidProjectStateException e) {
        System.out.println("InvalidProjectStateException - " + e.getMessage());
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("error", "This project has been closed"));
    }
}