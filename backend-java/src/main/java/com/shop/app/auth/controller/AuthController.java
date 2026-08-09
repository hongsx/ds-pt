package com.shop.app.auth;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.shop.app.users.entity.User;
import com.shop.app.users.service.UserService;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private UserService userService;

    @Autowired
    private JwtUtil jwtUtil;

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
        String token = jwtUtil.generateToken(String.valueOf(u.getId()));
        Map<String, Object> resp = new HashMap<>();
        resp.put("token", token);
        resp.put("user", Map.of("id", u.getId(), "email", u.getEmail()));

        // set HttpOnly cookie as well
        ResponseCookie cookie = ResponseCookie.from("jwt", token)
                .httpOnly(true)
                .path("/")
                .maxAge(jwtUtil.getExpirationSeconds())
                .sameSite("Lax")
                .build();

        return ResponseEntity.ok().header(HttpHeaders.SET_COOKIE, cookie.toString()).body(resp);
    }
}
