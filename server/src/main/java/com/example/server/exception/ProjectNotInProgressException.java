package com.example.server.exception;

public class ProjectNotInProgressException extends RuntimeException {
    public ProjectNotInProgressException(String message) {
        super(message);
    }
}
