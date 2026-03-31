package com.placement.portal.controller;

import com.placement.portal.dto.StudentRequestDTO;
import com.placement.portal.dto.StudentResponseDTO;
import com.placement.portal.entity.Student;
import com.placement.portal.service.StudentService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.http.MediaType;

import java.util.List;

@RestController
@RequestMapping("/students")
@RequiredArgsConstructor
public class StudentController {
     private final StudentService studentService;

     @PostMapping(value = "/profile", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
     public StudentResponseDTO addStudent(
             @Valid @RequestPart("student") StudentRequestDTO dto,
             @RequestPart(value = "resume", required = false) MultipartFile resume){

         return studentService.addStudent(dto, resume);
     }

     @GetMapping
    public List<StudentResponseDTO> getAllStudents(){
         return studentService.getAllStudents();

     }

     @GetMapping("/{id}")
    public StudentResponseDTO getStudentById(@PathVariable Long id){

         return studentService.getStudentById(id);
     }

     //update
    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public StudentResponseDTO updateStudent(
            @PathVariable Long id,
            @Valid @RequestPart("student") StudentRequestDTO dto,
            @RequestPart(value = "resume", required = false) MultipartFile resume ){
          return studentService.updateStudent(id, dto, resume);
    }

    @DeleteMapping("/{id}")

    public String deleteStudent(@PathVariable Long id){

          studentService.deleteStudent(id);
         return "Student deleted successfully";
    }
    @GetMapping("/me")
    public StudentResponseDTO getMyProfile(Authentication authentication){

        return studentService.getMyProfile(authentication);
    }
}
