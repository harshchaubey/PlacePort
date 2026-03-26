package com.placement.portal.dto;

import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class StudentRequestDTO {


       @NotBlank(message = "Name is required")
        private String name;

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
        private String email;

    @NotBlank(message = "Roll number is required")
        private String rollNo;

    @NotBlank(message = "Branch is required")
        private String branch;

    @DecimalMin(value = "0.0", message = "CGPA must be>=0")
    @DecimalMax(value="10.0", message = "CGPA must be <=10")
        private double cgpa;

    @Min(value = 1, message = "Year must be >= 1")
    @Max(value = 4, message = "Year must be <= 4")
        private int year;


    }


