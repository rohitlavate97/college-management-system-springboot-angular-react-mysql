package com.cms.module.examination.repository;

import com.cms.module.examination.entity.Result;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ResultRepository extends JpaRepository<Result, Long> {
    List<Result> findByStudentId(Long studentId);
    List<Result> findByExamSubjectId(Long examSubjectId);
    List<Result> findByStudentIdAndExamSubjectExaminationId(Long studentId, Long examinationId);
    Optional<Result> findByStudentIdAndExamSubjectId(Long studentId, Long examSubjectId);
}
