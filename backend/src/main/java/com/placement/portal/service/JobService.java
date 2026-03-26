package com.placement.portal.service;

import com.placement.portal.dto.JobRequestDTO;
import com.placement.portal.dto.JobResponseDTO;
import com.placement.portal.entity.Job;
import org.springframework.security.core.Authentication;

import java.util.List;

public interface JobService {

    JobResponseDTO postJob(JobRequestDTO dto, Authentication authentication);
    List<JobResponseDTO> getAllJobs();
    JobResponseDTO getJobById(Long id);
    List<JobResponseDTO> getJobsByBranch(String Branch);
    List<JobResponseDTO> getJobByCompany(Authentication authentication);
}
