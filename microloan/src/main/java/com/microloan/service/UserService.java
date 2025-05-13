package com.microloan.service;

import com.microloan.dto.LoginRequest;
import com.microloan.model.Admin;
import com.microloan.model.User;
import com.microloan.repository.AdminRepository;
import com.microloan.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AdminRepository adminRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Optional<Admin> admin = adminRepository.findByEmail(username);
        if (admin.isPresent()) {
            Admin a = admin.get();
            return org.springframework.security.core.userdetails.User
                    .withUsername(a.getEmail())
                    .password(a.getPassword())
                    .roles(a.getRole() != null ? a.getRole() : "ADMIN")
                    .build();
        }

        User user = userRepository.findByEmail(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + username));
        return org.springframework.security.core.userdetails.User
                .withUsername(user.getEmail())
                .password(user.getPassword())
                .roles(user.getRole() != null ? user.getRole() : "USER")
                .build();
    }

    public Admin registerAdmin(Admin admin) {
        admin.setPassword(passwordEncoder.encode(admin.getPassword()));
        admin.setRole("ADMIN");
        return adminRepository.save(admin);
    }

    public User registerUser(User user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setRole("USER");
        return userRepository.save(user);
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User updateCibilScore(Long id, Integer cibilScore) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setCibilScore(cibilScore);
        return userRepository.save(user);
    }

    public void deleteUser(Long id) {
        if (!userRepository.existsById(id)) {
            throw new RuntimeException("User not found with id: " + id);
        }
        try {
            userRepository.deleteById(id);
        } catch (Exception e) {
            throw new RuntimeException("Failed to delete user: " + e.getMessage());
        }
    }

    public Object loginUser(LoginRequest loginRequest) {
        User user = userRepository.findByEmail(loginRequest.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid email or password"));
        if (!passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid email or password");
        }
        // For simplicity, returning user details. In real app, return JWT or session info.
        return user;
    }

    public User getUserProfile(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public Integer getCibilScore(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return user.getCibilScore();
    }
}