package com.example.server.exception;

import com.example.server.model.enums.UserStatus;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class InactiveUserException extends RuntimeException{
    private UserStatus userStatus;
    public InactiveUserException(UserStatus userStatus, String message) {
        super(message);
        this.userStatus = userStatus;
    }
}
