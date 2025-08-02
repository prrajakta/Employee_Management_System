package com.example.employee_management.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;

@Component
public class JwtUtil {

    // Secret key used to sign the JWT (must be 48+ characters for HS256)
    private final String SECRET_KEY = "mysecretkey123456789012345678901234567890";

    // Expiry time for token: 24 hours
    private final long EXPIRATION_TIME = 86400000;

    // Generate the signing key from the secret string
    private Key getSigningKey() {
        return Keys.hmacShaKeyFor(SECRET_KEY.getBytes());
    }

    // ✅ 1. Generate a token for a given username
    public String generateToken(String username) {
        return Jwts.builder()
                .setSubject(username)                     // what user this token is for
                .setIssuer("employee-api")                // who issued it
                .setIssuedAt(new Date())                  // when it was issued
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME)) // expiry
                .signWith(getSigningKey())                // sign the token
                .compact();                               // build token string
    }

    // ✅ 2. Extract username from token
    public String extractUsername(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
    }

    // ✅ 3. Check if the token is valid
    public boolean isTokenValid(String token) {
        try {
            Claims claims = extractClaims(token);
            String username = claims.getSubject();
            Date expiration = claims.getExpiration();

            System.out.println("👤 Username in token: " + username);
            System.out.println("⏰ Expiration time: " + expiration);
            System.out.println("🕐 Current time: " + new Date());
            System.out.println("⛔ Expired? " + expiration.before(new Date()));

            return (username != null && !expiration.before(new Date()));
        } catch (Exception e) {
            System.out.println("❗ Token validation failed: " + e.getMessage());
            return false;
        }
    }

    public Claims extractClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSigningKey())  // ✅ Call the method
                .build()
                .parseClaimsJws(token)
                .getBody();
    }
}
