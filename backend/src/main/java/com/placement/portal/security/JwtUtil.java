package com.placement.portal.security;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;

@Component
public class JwtUtil {

    private final String key = "my-super-secret-key-my-super-secret-key";

    private Key getKey() {
        return Keys.hmacShaKeyFor(key.getBytes());
    }

    public String generateToken(String email){

        return Jwts.builder()
                .setSubject(email)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + 1000*60*60*24))
                .signWith(getKey())
                .compact();

    }

    public String extractEmail(String token){

        return Jwts.parser()
                .setSigningKey(getKey())
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
    }
}
