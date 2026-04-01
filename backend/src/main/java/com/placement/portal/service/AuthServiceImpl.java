package com.placement.portal.service;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import com.placement.portal.dto.auth.GoogleAuthResponse;
import com.placement.portal.dto.auth.RegisterRequest;
import com.placement.portal.entity.Role;
import com.placement.portal.entity.User;
import com.placement.portal.repository.UserRepository;
import com.placement.portal.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    @Value("${google.client.id}")
    private String googleClientId;

    @Override
    public void register(RegisterRequest request) {

        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Email already registered");
        }

        User user = User.builder()
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(request.getRole())
                .build();

        userRepository.save(user);
    }

    @Override
    public String login(String email, String password){
         User user = userRepository.findByEmail(email)
                 .orElseThrow(() -> new RuntimeException("Invalid email or password"));

         if(!passwordEncoder.matches(password, user.getPassword())){
             throw new RuntimeException("Invalid password");
         }

         return jwtUtil.generateToken(user.getEmail());
    }

    @Override
    public GoogleAuthResponse loginWithGoogle(String credential, String role) {
        try {
            GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(new NetHttpTransport(), new GsonFactory())
                    .setAudience(Collections.singletonList(googleClientId))
                    .build();

            GoogleIdToken idToken = verifier.verify(credential);
            if (idToken == null) {
                throw new RuntimeException("Invalid Google token");
            }

            GoogleIdToken.Payload payload = idToken.getPayload();
            String email = payload.getEmail();
            String googleId = payload.getSubject();

            Optional<User> userOpt = userRepository.findByEmail(email);
            User user;
            boolean needsProfile = false;

            if (userOpt.isPresent()) {
                user = userOpt.get();
                if (user.getGoogleId() == null) {
                    user.setGoogleId(googleId);
                    userRepository.save(user);
                }
            } else {
                if (role == null || role.isEmpty()) {
                    throw new RuntimeException("Role is required for new users");
                }
                user = User.builder()
                        .email(email)
                        .googleId(googleId)
                        .role(Role.valueOf(role.toUpperCase()))
                        .build();
                userRepository.save(user);
                needsProfile = true;
            }

            String token = jwtUtil.generateToken(user.getEmail());
            return GoogleAuthResponse.builder()
                    .token(token)
                    .role(user.getRole())
                    .needsProfile(needsProfile)
                    .build();

        } catch (Exception e) {
            throw new RuntimeException("Google authentication failed: " + e.getMessage());
        }
    }
}