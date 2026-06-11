package com.placement.portal.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

import java.util.List;

@Data
public class JobRequestDTO {

    @NotBlank(message = "Job title is required")
    private String title;

    @NotBlank(message = "Job description is required")
    private String description;

    @DecimalMin(value = "0.0", message = "Minimum CGPA must be >= 0")
    @DecimalMax(value = "10.0", message = "Minimum CGPA must be <= 10")
    private double minCgpa;

    @NotBlank(message = "Eligible branch is required")
    private String eligibleBranch;

    @NotBlank(message = "Last date is required")
    private String lastDate;

    private String salary;
    private List<String> skills;
    private List<String> responsibilities;
    private List<String> requirements;
}

