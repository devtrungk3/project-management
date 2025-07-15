package com.example.server.exception;

public class JoinRequestExistsException extends RuntimeException {
    public JoinRequestExistsException(String message) {
        super(message);
    }
}
