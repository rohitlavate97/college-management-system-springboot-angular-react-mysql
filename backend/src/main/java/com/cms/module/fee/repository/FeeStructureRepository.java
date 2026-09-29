package com.cms.module.fee.repository;

import com.cms.module.fee.domain.entity.FeeStructure;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface FeeStructureRepository extends JpaRepository<FeeStructure, Long> {
    List<FeeStructure> findByCourseId(Long courseId);
    List<FeeStructure> findByAcademicYear(String academicYear);
}
