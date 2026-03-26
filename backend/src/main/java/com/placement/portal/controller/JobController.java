package com.placement.portal.controller;

import com.placement.portal.dto.JobRequestDTO;
import com.placement.portal.dto.JobResponseDTO;
import com.placement.portal.service.JobService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/jobs")
@RequiredArgsConstructor
public class JobController {

    private final JobService jobService;
    @PostMapping("/post")
    public JobResponseDTO postJob(@RequestBody JobRequestDTO dto, Authentication authentication) {
        System.out.println(authentication.getName());
         return jobService.postJob(dto,authentication);
    }
    @GetMapping("/All")
    public List<JobResponseDTO> getAllJobs(){
        return jobService.getAllJobs();
    }

    @GetMapping("/{id}")
    public JobResponseDTO getJobById(@PathVariable Long id){
        return jobService.getJobById(id);
    }

    @GetMapping("/branch/{branch}")
    public List<JobResponseDTO> getJobsByBranch(@PathVariable String branch){
        return jobService.getJobsByBranch(branch);
    }
    @GetMapping("/company")
    public List<JobResponseDTO>  getJobByCompany(Authentication authentication){
         return jobService.getJobByCompany(authentication);
    }




}
