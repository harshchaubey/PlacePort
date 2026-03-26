package com.placement.portal.repository;

import com.placement.portal.entity.Company;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CompanyRepository extends JpaRepository<Company, Long> {

    List<Company> findByVerifiedFalse();
    Optional<Company> findByEmail(String email);

}
