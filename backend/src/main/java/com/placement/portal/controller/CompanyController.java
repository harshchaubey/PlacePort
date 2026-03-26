package com.placement.portal.controller;

import com.placement.portal.dto.CompanyRequestDTO;
import com.placement.portal.dto.CompanyResponseDTO;
import com.placement.portal.entity.Company;
import com.placement.portal.repository.CompanyRepository;
import com.placement.portal.service.CompanyService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/companies")
@RequiredArgsConstructor
public class CompanyController {

    private final CompanyService companyService;
    @PostMapping("/profile")
    public ResponseEntity<CompanyResponseDTO> registerCompany(@Valid @RequestBody CompanyRequestDTO dto){
         return ResponseEntity.status(HttpStatus.CREATED).body(companyService.registerCompany(dto));
    }

    @GetMapping
    public List<CompanyResponseDTO> getAllCompanies(){
        return companyService.getAllCompanies();
    }

    @GetMapping("/company/{id}")
    public CompanyResponseDTO getCompanyById(@PathVariable Long id){
         return companyService.getCompanyById(id);
    }

    @PutMapping("/verify/{id}")
    public CompanyResponseDTO verifyCompany(@PathVariable Long id){
        return companyService.verifyCompany(id);
    }

    @GetMapping("/pending")
    public List<CompanyResponseDTO> getPendingCompanies(){
        return companyService.getPendingCompanies();
    }

    @GetMapping("/me")
    public CompanyResponseDTO getMyProfile(Authentication authentication){
        return companyService.getCompanyByEmail(authentication);
    }


}
