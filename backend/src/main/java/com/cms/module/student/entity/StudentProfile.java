package com.cms.module.student.entity;

import com.cms.common.BaseEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@Entity
@Table(name = "student_profiles")
public class StudentProfile extends BaseEntity {

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false, unique = true)
    private Student student;

    private LocalDate dateOfBirth;
    
    private String gender;
    
    private String bloodGroup;
    
    private String nationality;
    
    private String religion;
    
    private String category;
    
    @Column(columnDefinition = "TEXT")
    private String permanentAddress;
    
    @Column(columnDefinition = "TEXT")
    private String currentAddress;
    
    private String photoUrl;
}
