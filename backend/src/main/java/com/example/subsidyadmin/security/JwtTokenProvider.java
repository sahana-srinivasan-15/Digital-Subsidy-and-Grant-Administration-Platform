package com.example.subsidyadmin.security;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Component
public class JwtTokenProvider {

    private final Key key;
    private final long accessTokenValidityInMs;
    private final long refreshTokenValidityInMs;

    public JwtTokenProvider(@Value("${jwt.secret:subsidyadminSecretKeyForJwtTokenGeneration512BitsMinimumKeyNationalPortal2026}") String secret,
                            @Value("${jwt.access-token-expiration-minutes:15}") long accessMinutes,
                            @Value("${jwt.refresh-token-expiration-days:7}") long refreshDays) {
        byte[] secretBytes = secret.getBytes();
        if (secretBytes.length < 64) {
            byte[] padded = new byte[64];
            System.arraycopy(secretBytes, 0, padded, 0, secretBytes.length);
            for (int i = secretBytes.length; i < 64; i++) {
                padded[i] = (byte) '#';
            }
            this.key = Keys.hmacShaKeyFor(padded);
        } else {
            this.key = Keys.hmacShaKeyFor(secretBytes);
        }
        this.accessTokenValidityInMs = accessMinutes * 60 * 1000;
        this.refreshTokenValidityInMs = refreshDays * 24 * 60 * 60 * 1000;
    }

    public String generateAccessToken(Long userId, String role) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("role", role);
        return doGenerateToken(claims, userId.toString(), accessTokenValidityInMs);
    }

    public String generateRefreshToken(Long userId) {
        return doGenerateToken(new HashMap<>(), userId.toString(), refreshTokenValidityInMs);
    }

    private String doGenerateToken(Map<String, Object> claims, String subject, long validityInMs) {
        Date now = new Date();
        Date expiry = new Date(now.getTime() + validityInMs);
        return Jwts.builder()
                .setClaims(claims)
                .setSubject(subject)
                .setIssuedAt(now)
                .setExpiration(expiry)
                .signWith(key, SignatureAlgorithm.HS512)
                .compact();
    }

    public boolean validateToken(String token) {
        try {
            Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(token);
            return true;
        } catch (Exception ex) {
            return false;
        }
    }

    public Long getUserIdFromToken(String token) {
        String subject = Jwts.parserBuilder().setSigningKey(key).build()
                .parseClaimsJws(token).getBody().getSubject();
        return Long.parseLong(subject);
    }

    public String getRoleFromToken(String token) {
        Object role = Jwts.parserBuilder().setSigningKey(key).build()
                .parseClaimsJws(token).getBody().get("role");
        return role != null ? role.toString() : null;
    }
}
