package com.placement.portal.controller;

import com.placement.portal.dto.StudentRequestDTO;
import com.placement.portal.dto.StudentResponseDTO;
import com.placement.portal.entity.Student;
import com.placement.portal.service.StudentService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/students")
@RequiredArgsConstructor
public class StudentController {
     private final StudentService studentService;

     @PostMapping("/profile")
     public StudentResponseDTO addStudent(@Valid @RequestBody StudentRequestDTO dto){

         return studentService.addStudent(dto);
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
    @PutMapping("/{id}")
    public StudentResponseDTO updateStudent(@PathVariable Long id,
                                            @Valid @RequestBody StudentRequestDTO dto ){
          return studentService.updateStudent(id,dto);
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
