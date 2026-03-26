package com.placement.portal.service;

import com.placement.portal.dto.CompanyRequestDTO;
import com.placement.portal.dto.CompanyResponseDTO;
import com.placement.portal.entity.Company;
import com.placement.portal.exception.BadRequestException;
import com.placement.portal.exception.ResourceNotFoundException;
import com.placement.portal.repository.CompanyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CompanyServiceImpl implements CompanyService{
    private final CompanyRepository companyRepository;

    @Override
    public CompanyResponseDTO registerCompany(CompanyRequestDTO dto){

        Company company = new Company();
         company.setCompanyName(dto.getCompanyName());
         company.setEmail(dto.getEmail());
         company.setLocation(dto.getLocation());
         company.setVerified(true);

         Company savedCompany = companyRepository.save(company);
         return mapToResponse(savedCompany);
    }

    @Override
    public List<CompanyResponseDTO>  getAllCompanies(){

        return companyRepository.findAll()
                .stream()
                .map(this:: mapToResponse)
                .toList();
    }

    @Override
    public CompanyResponseDTO getCompanyById(Long id){
        Company company = companyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Company not found"));

         return mapToResponse(company);
    }

    @Override
     public CompanyResponseDTO verifyCompany(Long id){
        Company company = companyRepository.findById(id)
                .orElseThrow(() -> new BadRequestException("Company is not  verify"));
        company.setVerified(true);

        Company updatedCompany = companyRepository.save(company);
        return mapToResponse(updatedCompany);
    }

    @Override
    public List<CompanyResponseDTO> getPendingCompanies(){

        return companyRepository.findByVerifiedFalse()
                .stream()
                .map(this :: mapToResponse)
                .toList();
    }
    @Override

    public CompanyResponseDTO getCompanyByEmail(Authentication authentication){
        String email = authentication.getName();
      //  System.out.println(authentication.getName());
        Company company = companyRepository
                .findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Company not found"));
        return mapToResponse(company);
    }



    private CompanyResponseDTO mapToResponse(Company company){
          return new CompanyResponseDTO(
                  company.getId(),
                  company.getCompanyName(),
                  company.getEmail(),
                  company.getLocation(),
                  company.isVerified()
          );
    }



}
