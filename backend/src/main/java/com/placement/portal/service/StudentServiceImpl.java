package com.placement.portal.service;

import com.placement.portal.dto.StudentRequestDTO;
import com.placement.portal.dto.StudentResponseDTO;
import com.placement.portal.entity.Student;
import com.placement.portal.exception.ResourceNotFoundException;
import com.placement.portal.repository.StudentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.net.Authenticator;
import java.util.List;

@Service
@RequiredArgsConstructor
public class StudentServiceImpl implements StudentService{

    private final StudentRepository studentRepository;

    @Override
    public StudentResponseDTO addStudent(StudentRequestDTO dto){

        Student student = new Student();
        student.setName(dto.getName());
        student.setEmail(dto.getEmail());
        student.setRollNo(dto.getRollNo());
        student.setBranch(dto.getBranch());
        student.setCgpa(dto.getCgpa());
        student.setYear(dto.getYear());

        Student saved = studentRepository.save(student);
        return mapToResponse(saved);
    }



    @Override
    public List<StudentResponseDTO> getAllStudents(){

        return studentRepository.findAll()
                .stream()
                .map(this:: mapToResponse)
                .toList();
    }

    @Override
    public StudentResponseDTO getStudentById(Long id){
        Student student =  studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found"));
          return mapToResponse(student);
    }

    @Override
    public StudentResponseDTO updateStudent(Long id, StudentRequestDTO dto){
          Student student = studentRepository.findById(id)
                          .orElseThrow(() -> new ResourceNotFoundException("Student not found"));

          student.setName(dto.getName());
          student.setEmail(dto.getEmail());
          student.setRollNo(dto.getRollNo());
          student.setBranch(dto.getBranch());
          student.setCgpa(dto.getCgpa());
          student.setYear(dto.getYear());

          Student updatedStudent =  studentRepository.save(student);
          return mapToResponse(updatedStudent);

    }
    @Override
    public void deleteStudent(Long id){

        studentRepository.deleteById(id);

    }

    @Override
    public StudentResponseDTO getMyProfile(Authentication authentication){
        String email = authentication.getName();
        Student student = studentRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found"));
        return mapToResponse(student);
    }

    private StudentResponseDTO mapToResponse(Student student) {
        return new StudentResponseDTO(
                student.getId(),
                student.getName(),
                student.getEmail(),
                student.getRollNo(),
                student.getBranch(),
                student.getCgpa(),
                student.getYear()
        );
    }
}
