package com.example.server.exception;

public class UserNotInProjectException extends RuntimeException{
    public UserNotInProjectException(String message) {
        super(message);
    }
}
