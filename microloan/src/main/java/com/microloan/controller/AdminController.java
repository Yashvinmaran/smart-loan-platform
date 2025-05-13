package com.microloan.controller;

import com.microloan.model.Admin;
import com.microloan.model.Loan;
import com.microloan.model.User;
import com.microloan.service.JwtService;
import com.microloan.service.LoanService;
import com.microloan.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/admin")
public class AdminController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private UserService userService;

    @Autowired
    private LoanService loanService;

    @PostMapping("/register")
    public ResponseEntity<Admin> register(@RequestBody Admin admin) {
        Admin registeredAdmin = userService.registerAdmin(admin);
        return ResponseEntity.ok(registeredAdmin);
    }

    @PostMapping("/login")
    public ResponseEntity<String> adminLogin(@RequestBody LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword())
        );
        if (authentication.isAuthenticated()) {
            UserDetails userDetails = userService.loadUserByUsername(loginRequest.getEmail());
            String jwtToken = jwtService.generateToken(userDetails);
            return ResponseEntity.ok(jwtToken);
        }
        return ResponseEntity.status(401).body("Invalid credentials");
    }

    @GetMapping("/users")
    public ResponseEntity<List<User>> getUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @GetMapping("/loans")
    public ResponseEntity<List<Loan>> getLoans() {
        return ResponseEntity.ok(loanService.getAllLoans());
    }

    @PutMapping("/loan/status/{id}")
    public ResponseEntity<Loan> updateLoanStatus(@PathVariable Long id, @RequestBody Map<String, String> body) {
        String status = body.get("status");
        Loan updatedLoan = loanService.updateLoanStatus(id, status);
        return ResponseEntity.ok(updatedLoan);
    }

    @PutMapping("/cibil/{id}")
    public ResponseEntity<User> updateCibil(@PathVariable Long id, @RequestBody Map<String, Integer> body) {
        Integer cibilScore = body.get("cibilScore");
        User updatedUser = userService.updateCibilScore(id, cibilScore);
        return ResponseEntity.ok(updatedUser);
    }

    @DeleteMapping("/user/{id}")
    public ResponseEntity<String> deleteUser(@PathVariable Long id) {
        try {
            userService.deleteUser(id);
            return ResponseEntity.ok("User deleted successfully");
        } catch (RuntimeException e) {
            return ResponseEntity.status(400).body(e.getMessage());
        }
    }
}

class LoginRequest {
    private String email;
    private String password;

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}