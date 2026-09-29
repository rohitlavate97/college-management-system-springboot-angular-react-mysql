package com.cms.module.student.entity;

import com.cms.common.BaseEntity;
import com.cms.module.course.entity.Course;
import com.cms.module.department.entity.Department;
import com.cms.module.user.entity.User;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@Entity
@Table(name = "students")
public class Student extends BaseEntity {

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "department_id", nullable = false)
    private Department department;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "course_id", nullable = false)
    private Course course;

    @OneToOne(mappedBy = "student", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private StudentProfile profile;

    @OneToMany(mappedBy = "student", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Guardian> guardians = new ArrayList<>();

    @Column(nullable = false, unique = true)
    private String rollNumber;

    @Column(nullable = false, unique = true)
    private String registrationNumber;

    private Integer currentSemester;

    private LocalDate admissionDate;

    private String admissionType;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StudentStatus status;

    private String batchYear;
    
    public void setProfile(StudentProfile profile) {
        if (profile != null) {
            profile.setStudent(this);
        }
        this.profile = profile;
    }
    
    public void addGuardian(Guardian guardian) {
        guardians.add(guardian);
        guardian.setStudent(this);
    }
    
    public void removeGuardian(Guardian guardian) {
        guardians.remove(guardian);
        guardian.setStudent(null);
    }
}
