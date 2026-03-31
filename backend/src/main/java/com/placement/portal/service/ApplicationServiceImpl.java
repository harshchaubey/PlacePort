package com.placement.portal.service;

import com.placement.portal.dto.ApplicationResponseDTO;
import com.placement.portal.entity.Application;
import com.placement.portal.entity.Job;
import com.placement.portal.entity.Student;
import com.placement.portal.exception.BadRequestException;
import com.placement.portal.exception.ResourceNotFoundException;
import com.placement.portal.repository.ApplicationRepository;
import com.placement.portal.repository.JobRepository;
import com.placement.portal.repository.StudentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ApplicationServiceImpl implements ApplicationService {

    private final ApplicationRepository applicationRepository;
    private final JobRepository jobRepository;
    private final StudentRepository studentRepository;


    @Override
    public ApplicationResponseDTO applyForJob(Long jobId) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
         Student student = studentRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with email: " + email));
       Long studentId = student.getId();
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found with id: "));

         if(applicationRepository.existsByStudentIdAndJobId(studentId, jobId)){
             throw new ResourceNotFoundException("You have already applied for this job");
         }
         
         String resumeUrl = student.getResumePath();
         if (resumeUrl == null || resumeUrl.isEmpty()) {
             throw new BadRequestException("Please upload a resume in your profile before applying");
         }

        Application application = new Application();
        application.setStudent(student);
        application.setJob(job);
        application.setResumePath(resumeUrl);
        application.setStatus("APPLIED");

        Application saved = applicationRepository.save(application);
        return mapToResponse(saved);
    }
    @Override
    public List<ApplicationResponseDTO> getApplicationsByStudent(Authentication authentication){
        String email = authentication.getName();
        Student student = studentRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with email: " + email));
        Long studentId = student.getId();
        return applicationRepository.findByStudentId(studentId)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public List<ApplicationResponseDTO> getApplicationsByJob(Long jobId){
        return applicationRepository.findByJobId(jobId)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }
    @Override
    public List<ApplicationResponseDTO> getApplicationByEmail(String email){
        return applicationRepository.findByStudentEmail(email)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

  /*  @Override
     public List<ApplicationResponseDTO> getApplicationsByCompany(Authentication authentication){
        String email = authentication.getName();
        Company company = companyRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Company not found with email: "));
        Long companyId = company.getId();
        return applicationRepository.findByCompanyId(companyId)
                .stream()
                .map(this::mapToResponse)
                .toList();
     }*/



    @Override
    public ApplicationResponseDTO updateStatus(Long applicationId, String status) {
        Application application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new ResourceNotFoundException("Application not found with id: " + applicationId));
        application.setStatus(status.toUpperCase());
        Application saved = applicationRepository.save(application);
        return mapToResponse(saved);
    }

    private ApplicationResponseDTO mapToResponse(Application application){
          return new ApplicationResponseDTO(
                  application.getId(),
                  application.getStatus(),
                  application.getStudent().getId(),
                  application.getStudent().getName(),
                  application.getJob().getId(),
                  application.getJob().getTitle(),
                  application.getJob().getCompany().getCompanyName(),

                  application.getResumePath()
          );
    }

}
