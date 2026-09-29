package com.cms.module.course.entity;

import com.cms.common.BaseEntity;
import com.cms.module.department.entity.Department;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "courses")
public class Course extends BaseEntity {

    @Column(nullable = false, unique = true)
    private String code;

    @Column(nullable = false)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "department_id", nullable = false)
    private Department department;

    @Column(name = "duration_years", nullable = false)
    private Integer durationYears;

    @Column(name = "total_semesters", nullable = false)
    private Integer totalSemesters;

    @Column(name = "degree_type", nullable = false)
    private String degreeType;

    @Column(name = "is_active", nullable = false)
    private Boolean isActive = true;
}
