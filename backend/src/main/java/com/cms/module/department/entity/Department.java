package com.cms.module.department.entity;

import com.cms.common.BaseEntity;
import com.cms.module.college.entity.College;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "departments", uniqueConstraints = {
    @UniqueConstraint(name = "uk_departments_code", columnNames = "code"),
    @UniqueConstraint(name = "uk_departments_name_college", columnNames = {"name", "college_id"})
})
@Getter
@Setter
public class Department extends BaseEntity {

    @Column(nullable = false, length = 100)
    private String name;

    @Column(nullable = false, unique = true, length = 20)
    private String code;

    private String description;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "college_id", nullable = false)
    private College college;

    @Column(name = "hod_id")
    private Long hodId;

    @Column(nullable = false, name = "is_active")
    private Boolean isActive = true;
}
