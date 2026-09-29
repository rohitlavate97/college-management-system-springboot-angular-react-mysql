package com.cms.module.examination.repository;

import com.cms.module.examination.entity.ExamSubject;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ExamSubjectRepository extends JpaRepository<ExamSubject, Long> {
    List<ExamSubject> findByExaminationId(Long examinationId);
    List<ExamSubject> findBySubjectId(Long subjectId);
}
