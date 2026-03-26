package com.placement.portal.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name= "jobs")
public class Job {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String title;
    private String description;
    private double minCgpa;
    private String eligibleBranch;
    private String lastDate;

    @ManyToOne
    @JoinColumn(name = "company_id") // create a foreign key column in the current table

    @JsonIgnoreProperties("jobs")
    private Company company; // store the company object.
}
