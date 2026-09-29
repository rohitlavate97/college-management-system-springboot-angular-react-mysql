package com.cms.module.examination.repository;

import com.cms.module.examination.entity.Examination;
import com.cms.module.examination.enums.ExaminationStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ExaminationRepository extends JpaRepository<Examination, Long> {
    List<Examination> findByAcademicYear(String academicYear);
    Page<Examination> findByStatus(ExaminationStatus status, Pageable pageable);
}
