package com.cms.module.examination.entity;

import com.cms.common.BaseEntity;
import com.cms.module.user.entity.User;
import com.cms.module.examination.enums.ExaminationStatus;
import com.cms.module.examination.enums.ExaminationType;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Table(name = "examinations")
@Getter
@Setter
public class Examination extends BaseEntity {

    @Column(nullable = false, length = 100)
    private String name;

    @Column(name = "academic_year", nullable = false, length = 9)
    private String academicYear;

    @Column(nullable = false)
    private Integer semester;

    @Enumerated(EnumType.STRING)
    @Column(name = "exam_type", nullable = false, length = 30)
    private ExaminationType examType;

    @Column(name = "start_date", nullable = false)
    private LocalDate startDate;

    @Column(name = "end_date", nullable = false)
    private LocalDate endDate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private ExaminationStatus status = ExaminationStatus.SCHEDULED;

    @Column(columnDefinition = "TEXT")
    private String description;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by", nullable = false)
    private User createdBy;
}
