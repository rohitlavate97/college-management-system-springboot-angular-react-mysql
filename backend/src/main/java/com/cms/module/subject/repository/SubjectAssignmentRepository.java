package com.cms.module.subject.repository;

import com.cms.module.subject.entity.SubjectAssignment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SubjectAssignmentRepository extends JpaRepository<SubjectAssignment, Long> {
    List<SubjectAssignment> findBySubjectId(Long subjectId);
    List<SubjectAssignment> findByProfessorId(Long professorId);
    Optional<SubjectAssignment> findBySubjectIdAndProfessorIdAndAcademicYearAndSemester(Long subjectId, Long professorId, String academicYear, Integer semester);
}
