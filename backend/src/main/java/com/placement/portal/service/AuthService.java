package com.placement.portal.service;

import com.placement.portal.dto.auth.RegisterRequest;

import com.placement.portal.dto.auth.GoogleAuthResponse;

public interface AuthService {
    void register (RegisterRequest request);
    String login(String email,String password);
    GoogleAuthResponse loginWithGoogle(String credential, String role);
}
