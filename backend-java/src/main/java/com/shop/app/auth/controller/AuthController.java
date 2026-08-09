package com.shop.app.auth.controller;

import com.shop.app.auth.JwtUtil;
import com.shop.app.auth.RefreshTokenService;
import com.shop.app.users.entity.User;
import com.shop.app.users.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private UserService userService;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private RefreshTokenService refreshTokenService;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        String password = body.get("password");
        if (email == null || password == null) return ResponseEntity.badRequest().body("email and password required");
        User exists = userService.findByEmail(email);
        if (exists != null) return ResponseEntity.status(409).body("user exists");
        User u = userService.create(email, password);
        Map<String, Object> resp = new HashMap<>();
        resp.put("id", u.getId());
        resp.put("email", u.getEmail());
        return ResponseEntity.status(201).body(resp);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        String password = body.get("password");
        if (email == null || password == null) return ResponseEntity.badRequest().body("email and password required");
        User u = userService.findByEmail(email);
        if (u == null) return ResponseEntity.status(401).body("invalid credentials");
        boolean ok = userService.checkPassword(u, password);
        if (!ok) return ResponseEntity.status(401).body("invalid credentials");
        String accessToken = jwtUtil.generateToken(String.valueOf(u.getId()));
        // create refresh token and persist
        String refreshToken = refreshTokenService.createRefreshToken(u.getId(), 7 * 24 * 3600); // 7 days

        Map<String, Object> resp = new HashMap<>();
        resp.put("token", accessToken);
        resp.put("user", Map.of("id", u.getId(), "email", u.getEmail()));

        // set HttpOnly access token cookie
        ResponseCookie accessCookie = ResponseCookie.from("jwt", accessToken)
                .httpOnly(true)
                .path("/")
                .maxAge(jwtUtil.getExpirationSeconds())
                .sameSite("Lax")
                .secure(false)
                .build();

        // set HttpOnly refresh token cookie
        ResponseCookie refreshCookie = ResponseCookie.from("refresh_jwt", refreshToken)
                .httpOnly(true)
                .path("/auth/refresh")
                .maxAge(7 * 24 * 3600)
                .sameSite("Lax")
                .secure(false)
                .build();

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, accessCookie.toString())
                .header(HttpHeaders.SET_COOKIE, refreshCookie.toString())
                .body(resp);
    }

    @PostMapping("/refresh")
    public ResponseEntity<?> refresh(@CookieValue(value = "refresh_jwt", required = false) String refreshToken) {
        Integer userId = refreshTokenService.validateRefreshToken(refreshToken);
        if (userId == null) return ResponseEntity.status(401).body("invalid refresh token");

        String newAccess = jwtUtil.generateToken(String.valueOf(userId));
        String newRefresh = refreshTokenService.createRefreshToken(userId, 7 * 24 * 3600);

        ResponseCookie accessCookie = ResponseCookie.from("jwt", newAccess)
                .httpOnly(true)
                .path("/")
                .maxAge(jwtUtil.getExpirationSeconds())
                .sameSite("Lax")
                .secure(false)
                .build();

        ResponseCookie refreshCookie = ResponseCookie.from("refresh_jwt", newRefresh)
                .httpOnly(true)
                .path("/auth/refresh")
                .maxAge(7 * 24 * 3600)
                .sameSite("Lax")
                .secure(false)
                .build();

        Map<String, Object> resp = new HashMap<>();
        resp.put("token", newAccess);
        return ResponseEntity.ok().header(HttpHeaders.SET_COOKIE, accessCookie.toString()).header(HttpHeaders.SET_COOKIE, refreshCookie.toString()).body(resp);
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(@CookieValue(value = "refresh_jwt", required = false) String refreshToken) {
        if (refreshToken != null) {
            refreshTokenService.revokeToken(refreshToken);
        }
        // clear cookies
        ResponseCookie clearAccess = ResponseCookie.from("jwt", "").httpOnly(true).path("/").maxAge(0).build();
        ResponseCookie clearRefresh = ResponseCookie.from("refresh_jwt", "").httpOnly(true).path("/auth/refresh").maxAge(0).build();
        return ResponseEntity.ok().header(HttpHeaders.SET_COOKIE, clearAccess.toString()).header(HttpHeaders.SET_COOKIE, clearRefresh.toString()).body(Map.of("ok", true));
    }
}
