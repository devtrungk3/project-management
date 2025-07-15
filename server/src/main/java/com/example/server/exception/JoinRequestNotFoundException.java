package com.example.server.exception;

public class JoinRequestNotFoundException extends RuntimeException{
    public JoinRequestNotFoundException(String message) {
        super(message);
    }
}
