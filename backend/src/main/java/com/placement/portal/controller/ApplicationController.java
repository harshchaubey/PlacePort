package com.placement.portal.controller;

import com.placement.portal.dto.ApplicationRequestDTO;
import com.placement.portal.dto.ApplicationResponseDTO;
import com.placement.portal.entity.Application;
import com.placement.portal.service.ApplicationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import com.placement.portal.service.CloudinaryService;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/applications")
@RequiredArgsConstructor
public class ApplicationController {
    private final ApplicationService applicationService;
    private final CloudinaryService cloudinaryService;
    @PostMapping("/apply/{jobId}")
    public ApplicationResponseDTO applyForJob(@PathVariable Long jobId,@RequestParam("resume") MultipartFile resume) {
        return applicationService.applyForJob(jobId , resume);
    }
    @GetMapping("/job/{jobId}")
    public List<ApplicationResponseDTO> getApplicationsByJobId(@PathVariable Long jobId){
        return applicationService.getApplicationsByJob(jobId);
    }

    @GetMapping("/student/{studentId}")
    public List<ApplicationResponseDTO> getApplicationsByStudentId(Authentication authentication){
        return applicationService.getApplicationsByStudent(authentication);
    }

   /* @GetMapping("/company")
    public List<ApplicationResponseDTO> getApplicationsByCompanyId(Authentication authentication){
          return applicationService.getApplicationsByCompany(authentication);
    }*/

   // @GetMapping("/status/{applicationId}")
   // public Application getApplicationStatus(@PathVariable Long applicationId ,
    //                                        @RequestParam String status){
    //    return applicationService.updateStatus(applicationId,status);
    //}
    @GetMapping("/my")
    public List<ApplicationResponseDTO> getMyApplications(Authentication authentication){
        return applicationService.getApplicationByEmail(authentication.getName());
    }
}
