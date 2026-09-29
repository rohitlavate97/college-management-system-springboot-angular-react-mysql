package com.cms.module.student.entity;

import com.cms.common.BaseEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "guardians")
public class Guardian extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String relationship;

    private String phone;

    private String email;

    private String occupation;

    @Column(columnDefinition = "TEXT")
    private String address;

    private Boolean isPrimary = false;
}
