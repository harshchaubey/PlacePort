package com.placement.portal.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class StudentResponseDTO {

    private Long id;
    private String name;
    private String email;
    private String rollNo;
    private String branch;
    private double cgpa;
    private int year;
}
