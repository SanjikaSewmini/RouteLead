package com.example.be.dto;

import com.example.be.types.UserRole;
import lombok.Data;

import java.time.ZonedDateTime;
import java.util.UUID;

@Data
public class ProfileDto {
    private UUID id;
    private String email;
    private UserRole role;
    private String firstName;
    private String lastName;
    private String phoneNumber;
    private String nicNumber;
    private String profilePhotoUrl;
    private Boolean isVerified;
    private ZonedDateTime createdAt;
    private ZonedDateTime updatedAt;
}

@Data
class ProfileRequestDto {
    private String email;
    private UserRole role;
    private String firstName;
    private String lastName;
    private String phoneNumber;
    private String nicNumber;
    private String profilePhotoUrl;
}

@Data
class ProfileUpdateRequestDto {
    private String firstName;
    private String lastName;
    private String phoneNumber;
    private String nicNumber;
    private String profilePhotoUrl;
} 