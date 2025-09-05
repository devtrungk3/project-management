package com.example.server.exception;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class TooManyRequestException extends RuntimeException {
    private String ipAddress;
    public TooManyRequestException(String message, String ipAddress) {
        super(message);
        this.ipAddress = ipAddress;
    }
}
