package com.placement.portal.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import java.util.List;

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
    private List<String> skills;
    private String resumePath;
}
