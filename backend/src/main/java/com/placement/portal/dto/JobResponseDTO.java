package com.placement.portal.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class JobResponseDTO {

    private Long id;
    private String title;
    private String description;
    private double minCgpa;
    private String eligibleBranch;
    private String lastDate;

    // company info (safe fields only)
    private Long companyId;
    private String companyName;
}
