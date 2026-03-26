package com.placement.portal.service;

import com.placement.portal.dto.ApplicationRequestDTO;
import com.placement.portal.dto.ApplicationResponseDTO;
import com.placement.portal.entity.Application;
import org.springframework.security.core.Authentication;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface ApplicationService {

    ApplicationResponseDTO applyForJob(Long jobId, MultipartFile resume);
    List<ApplicationResponseDTO> getApplicationsByStudent(Authentication authentication);
    List<ApplicationResponseDTO> getApplicationsByJob(Long jobId);
   // ApplicationResponseDTO updateStatus(Long applicationId,String status);
    List<ApplicationResponseDTO> getApplicationByEmail(String email);
   // List<ApplicationResponseDTO> getApplicationsByCompany(Authentication authentication);
}
