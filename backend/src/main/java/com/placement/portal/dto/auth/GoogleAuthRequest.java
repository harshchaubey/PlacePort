package com.placement.portal.dto.auth;

import lombok.Data;

@Data
public class GoogleAuthRequest {
    private String credential;
    private String role;
}
