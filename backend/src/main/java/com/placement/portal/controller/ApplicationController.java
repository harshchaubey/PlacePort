package com.placement.portal.controller;

import com.placement.portal.dto.ApplicationResponseDTO;
import com.placement.portal.dto.UpdateStatusDTO;
import com.placement.portal.service.ApplicationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/applications")
@RequiredArgsConstructor
public class ApplicationController {
    private final ApplicationService applicationService;

    @PostMapping("/apply/{jobId}")
    public ApplicationResponseDTO applyForJob(@PathVariable Long jobId) {
        return applicationService.applyForJob(jobId);
    }

    @GetMapping("/job/{jobId}")
    public List<ApplicationResponseDTO> getApplicationsByJobId(@PathVariable Long jobId){
        return applicationService.getApplicationsByJob(jobId);
    }

    @GetMapping("/student/{studentId}")
    public List<ApplicationResponseDTO> getApplicationsByStudentId(Authentication authentication){
        return applicationService.getApplicationsByStudent(authentication);
    }

    @GetMapping("/my")
    public List<ApplicationResponseDTO> getMyApplications(Authentication authentication){
        return applicationService.getApplicationByEmail(authentication.getName());
    }

    /** Company updates the status of an application */
    @PatchMapping("/{applicationId}/status")
    public ResponseEntity<ApplicationResponseDTO> updateStatus(
            @PathVariable Long applicationId,
            @RequestBody UpdateStatusDTO body) {
        ApplicationResponseDTO updated = applicationService.updateStatus(applicationId, body.getStatus());
        return ResponseEntity.ok(updated);
    }
}
