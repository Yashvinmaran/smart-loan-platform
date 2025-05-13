package com.microloan.service;

import com.microloan.dto.LoginRequest;
import com.microloan.exception.ResourceNotFoundException;
import com.microloan.model.Admin;
import com.microloan.model.Loan;
import com.microloan.model.User;
import com.microloan.repository.AdminRepository;
import com.microloan.repository.LoanRepository;
import com.microloan.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;

@Service
public class AdminService {

    @Autowired
    private AdminRepository adminRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private LoanRepository loanRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtService jwtService;

    public String loginAdmin(LoginRequest loginRequest) {
        Admin admin = adminRepository.findByEmail(loginRequest.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("Admin not found with email: " + loginRequest.getEmail()));

        if (!passwordEncoder.matches(loginRequest.getPassword(), admin.getPassword())) {
            throw new RuntimeException("Invalid credentials");
        }

        UserDetails userDetails = new org.springframework.security.core.userdetails.User(
                admin.getEmail(),
                admin.getPassword(),
                Collections.singletonList(new SimpleGrantedAuthority("ROLE_ADMIN"))
        );
        return jwtService.generateToken(userDetails);
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public List<Loan> getAllLoans() {
        return loanRepository.findAll();
    }

    public Loan updateLoanStatus(Long id, String status) {
        Loan loan = loanRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Loan not found with id: " + id));
        loan.setStatus(status);
        return loanRepository.save(loan);
    }

    public User updateCibilScore(Long id, Integer cibilScore) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
        user.setCibilScore(cibilScore);
        return userRepository.save(user);
    }

    public void deleteUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
        userRepository.delete(user);
    }
}