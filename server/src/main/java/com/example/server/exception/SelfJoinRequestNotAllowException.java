package com.example.server.exception;

public class SelfJoinRequestNotAllowException extends RuntimeException{
    public SelfJoinRequestNotAllowException(String message) {
        super(message);
    }
}
