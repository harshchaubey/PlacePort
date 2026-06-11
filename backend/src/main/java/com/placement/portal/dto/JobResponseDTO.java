package com.placement.portal.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class JobResponseDTO {

    private Long id;
    private String title;
    private String description;
    private double minCgpa;
    private String eligibleBranch;
    private String lastDate;
    private String salary;
    private List<String> skills;
    private List<String> responsibilities;
    private List<String> requirements;

    // company info (safe fields only)
    private Long companyId;
    private String companyName;
    private String companyLocation;
}
