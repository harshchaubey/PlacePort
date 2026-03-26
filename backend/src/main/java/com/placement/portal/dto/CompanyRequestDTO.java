package com.placement.portal.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CompanyRequestDTO {

    //@NotBlank(message = "Company name is required")
    private String companyName;

    @Email(message = "Invalid email format")
   @NotBlank(message = "Email is required")
    private String email;




    @NotBlank(message = "Location is required")
    private String location;
}
