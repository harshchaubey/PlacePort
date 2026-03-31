package com.placement.portal.entity;

import jakarta.persistence.*;
import lombok.*;
import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "students")
public class Student {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)

    private Long id;
    private String name;
    private String email;
    private String rollNo;
    private String branch;
    private double cgpa;
    private int year;

    @ElementCollection
    private List<String> skills;
    private String resumePath;

}
