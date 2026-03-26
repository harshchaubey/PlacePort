package com.placement.portal.repository;

import com.placement.portal.dto.ApplicationResponseDTO;
import com.placement.portal.entity.Application;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ApplicationRepository extends JpaRepository<Application, Long> {
    List<Application> findByStudentId(Long studentId);
    List<Application> findByJobId(Long jobId);
    List<Application> findByStudentEmail(String email);
    boolean existsByStudentIdAndJobId(Long studentId, Long jobId);
  //  List<Application> findByCompanyId(Long companyId);
}
