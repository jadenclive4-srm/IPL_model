package com.ipl.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AuthDTO {
    
    private String username;
    private String email;
    private String password;
    private String fullName;
    private String token;
    private Long userId;
    private String role;
}