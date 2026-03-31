package com.placement.portal.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ApplicationResponseDTO {

    private Long id;
    private String status;

    // student info
    private Long studentId;
    private String studentName;

    // job info
    private Long jobId;
    private String jobTitle;
    private String companyName;

    private String resumePath;
}
