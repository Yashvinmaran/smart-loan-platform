package com.microloan.service;

import com.microloan.dto.LoanRequest;
import com.microloan.exception.ResourceNotFoundException;
import com.microloan.model.Document;
import com.microloan.model.Loan;
import com.microloan.model.User;
import com.microloan.repository.DocumentRepository;
import com.microloan.repository.LoanRepository;
import com.microloan.repository.UserRepository;
import com.microloan.util.FileUploadUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

@Service
public class LoanService {

    @Autowired
    private LoanRepository loanRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private DocumentRepository documentRepository;

    @Autowired
    private FileUploadUtil fileUploadUtil;

    public Loan applyLoan(LoanRequest loanRequest) {
        User user = userRepository.findById(loanRequest.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + loanRequest.getUserId()));

        String aadharPath = fileUploadUtil.saveFile(loanRequest.getAadharFile());
        String panPath = fileUploadUtil.saveFile(loanRequest.getPanFile());

        Document document = new Document();
        document.setUser(user);
        document.setAadharFilePath(aadharPath);
        document.setPanFilePath(panPath);
        documentRepository.save(document);

        Loan loan = new Loan();
        loan.setUser(user);
        loan.setAmount(loanRequest.getAmount());
        loan.setType(loanRequest.getType());
        loan.setDuration(loanRequest.getDuration());
        loan.setStatus("PENDING");
        loan.setDate(LocalDate.now());

        return loanRepository.save(loan);
    }

    public Loan getLoanStatus(Long id) {
        return loanRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Loan not found with id: " + id));
    }

    public java.util.List<Loan> getAllLoans() {
        return loanRepository.findAll();
    }

    public Loan updateLoanStatus(Long loanId, String status) {
        Loan loan = loanRepository.findById(loanId)
                .orElseThrow(() -> new ResourceNotFoundException("Loan not found with id: " + loanId));
        loan.setStatus(status);
        return loanRepository.save(loan);
    }
}