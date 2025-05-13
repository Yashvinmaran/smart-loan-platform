package com.microloan.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

@Data
public class LoanRequest {
    @NotNull(message = "User ID is required")
    private Long userId;

    @NotNull(message = "Amount is required")
    @Min(value = 1000, message = "Amount must be at least 1000")
    private Double amount;

    @NotBlank(message = "Loan type is required")
    private String type;

    @NotNull(message = "Duration is required")
    @Min(value = 1, message = "Duration must be at least 1 month")
    private Integer duration;

    @NotNull(message = "Aadhar file is required")
    private MultipartFile aadharFile;

    @NotNull(message = "PAN file is required")
    private MultipartFile panFile;
}