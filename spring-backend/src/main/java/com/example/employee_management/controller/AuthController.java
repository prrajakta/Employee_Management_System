package com.example.employee_management.controller;

import com.example.employee_management.model.AuthRequest;
import com.example.employee_management.model.User;
import com.example.employee_management.repository.UserRepository;
import com.example.employee_management.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class AuthController {

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthRequest request) {
        System.out.println("🔥 Login attempt");
        String username = request.getUsername();
        String password = request.getPassword();

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("❌ Invalid credentials"));

        if (!request.getPassword().equals(user.getPassword())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("❌ Invalid credentials");
        }

        // ✅ Generate JWT token on successful login
        String token = jwtUtil.generateToken(username);

        return ResponseEntity.ok(
                java.util.Map.of(
                        "token", "Bearer " + token,
                        "role", user.getRole()
                )
        );
    }

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody AuthRequest request) {
        if (userRepository.findByUsername(request.getUsername()).isPresent()) {
            return ResponseEntity.badRequest().body("Username already exists.");
        }

        User user = new User();
        user.setUsername(request.getUsername());

        // ✅ Must encode password here
        user.setPassword(request.getPassword());

        user.setRole(request.getRole() != null ? request.getRole() : "USER");
       // user.setRole("USER"); // or "ADMIN" if you want to test
        userRepository.save(user);

        return ResponseEntity.ok("✅ User created successfully.");
    }


}
