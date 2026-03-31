package com.placement.portal.service;

import com.placement.portal.dto.StudentRequestDTO;
import com.placement.portal.dto.StudentResponseDTO;
import com.placement.portal.entity.Student;
import org.springframework.security.core.Authentication;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface StudentService {

    StudentResponseDTO addStudent(StudentRequestDTO dto, MultipartFile resume);

    List<StudentResponseDTO> getAllStudents();
    StudentResponseDTO getStudentById(Long id);
    StudentResponseDTO updateStudent(Long id, StudentRequestDTO dto, MultipartFile resume);
    StudentResponseDTO getMyProfile(Authentication authentication);
    void deleteStudent(Long id);
}
