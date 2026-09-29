package com.cms.module.professor.entity;

import com.cms.common.BaseEntity;
import com.cms.module.department.entity.Department;
import com.cms.module.user.entity.User;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@Entity
@Table(name = "professors")
public class Professor extends BaseEntity {

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "department_id", nullable = false)
    private Department department;

    @Column(nullable = false, unique = true)
    private String employeeId;

    @Column(nullable = false)
    private String designation;

    private String specialization;

    private String qualification;

    @Column(nullable = false)
    private LocalDate joiningDate;

    @Column(nullable = false)
    private String status;
}
