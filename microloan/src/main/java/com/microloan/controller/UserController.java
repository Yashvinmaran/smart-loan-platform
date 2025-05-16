package com.microloan.controller;

import com.microloan.dto.LoginRequest;
import com.microloan.model.User;
import com.microloan.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import java.util.Map;

@RestController
@RequestMapping("/user")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String, Object> userMap) {
        User user = new User();
        user.setFullName((String) userMap.get("fullName"));
        user.setEmail((String) userMap.get("email"));
        // Removed setMobile and setAddress calls as these methods do not exist in User model
        user.setPassword((String) userMap.get("password"));
        user.setRole("USER");
        // user.setAddress((String) userMap.get("address")); // Removed

        Map<String, String> documents = (Map<String, String>) userMap.get("documents");
        if (documents != null) {
            user.setAadhar(documents.get("aadhar"));
            user.setPan(documents.get("pan"));
        }

        return ResponseEntity.ok(userService.registerUser(user));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        try {
            Map<String, Object> response = userService.loginUser(loginRequest);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/profile/{id}")
    public ResponseEntity<?> getProfile(@PathVariable Long id) {
        return ResponseEntity.ok(userService.getUserProfile(id));
    }

    @GetMapping("/cibil/{id}")
    public ResponseEntity<?> getCibilScore(@PathVariable Long id) {
        return ResponseEntity.ok(userService.getCibilScore(id));
    }

    @GetMapping("/test/bcrypt")
    public String testBcrypt() {
        return passwordEncoder.encode("Yashvin@12345");
    }
}
