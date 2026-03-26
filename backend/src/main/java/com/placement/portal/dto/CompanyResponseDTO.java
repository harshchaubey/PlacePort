package com.placement.portal.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class CompanyResponseDTO {

    private Long id;
    private String companyName;
    private String email;
    private String location;
    private boolean verified;
}
