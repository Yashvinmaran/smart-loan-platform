package com.microloan.controller;

import com.microloan.dto.LoanRequest;
import com.microloan.service.LoanService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/loan")
public class LoanController {

    @Autowired
    private LoanService loanService;

    @PostMapping("/apply")
    public ResponseEntity<?> applyLoan(@Valid @ModelAttribute LoanRequest loanRequest) {
        return ResponseEntity.ok(loanService.applyLoan(loanRequest));
    }

    @GetMapping("/status/{id}")
    public ResponseEntity<?> getLoanStatus(@PathVariable Long id) {
        return ResponseEntity.ok(loanService.getLoanStatus(id));
    }
}