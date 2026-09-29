package com.cms.module.fee.domain.entity;

import com.cms.common.BaseEntity;
import com.cms.module.course.entity.Course;
import com.cms.module.fee.domain.enums.FeeType;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "fee_structures")
@Getter
@Setter
public class FeeStructure extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "course_id")
    private Course course;

    @Column(nullable = false)
    private String name;

    @Column(name = "academic_year", nullable = false)
    private String academicYear;

    private Integer semester;

    @Enumerated(EnumType.STRING)
    @Column(name = "fee_type", nullable = false)
    private FeeType feeType;

    @Column(nullable = false)
    private BigDecimal amount;

    @Column(name = "due_date")
    private LocalDate dueDate;

    @Column(name = "is_active", nullable = false)
    private Boolean isActive = true;
}
