package com.example.server.exception;

public class InvalidProjectStateException extends RuntimeException{
    public InvalidProjectStateException(String message) {
        super(message);
    }
}
