package com.example.server.exception;

public class InvalidJoinRequestException extends RuntimeException{
    public InvalidJoinRequestException(String message) {
        super(message);
    }
}
