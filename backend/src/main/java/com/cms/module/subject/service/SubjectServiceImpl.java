package com.cms.module.subject.service;

import com.cms.common.PageResponse;
import com.cms.exception.DuplicateResourceException;
import com.cms.exception.ResourceNotFoundException;
import com.cms.module.course.entity.Course;
import com.cms.module.course.repository.CourseRepository;
import com.cms.module.department.entity.Department;
import com.cms.module.department.repository.DepartmentRepository;
import com.cms.module.subject.dto.SubjectAssignmentRequest;
import com.cms.module.subject.dto.SubjectAssignmentResponse;
import com.cms.module.subject.dto.SubjectRequest;
import com.cms.module.subject.dto.SubjectResponse;
import com.cms.module.subject.dto.SubjectSummaryResponse;
import com.cms.module.subject.entity.Subject;
import com.cms.module.subject.entity.SubjectAssignment;
import com.cms.module.subject.mapper.SubjectAssignmentMapper;
import com.cms.module.subject.mapper.SubjectMapper;
import com.cms.module.subject.repository.SubjectAssignmentRepository;
import com.cms.module.subject.repository.SubjectRepository;
import com.cms.module.user.entity.User;
import com.cms.module.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SubjectServiceImpl implements SubjectService {

    private final SubjectRepository subjectRepository;
    private final SubjectAssignmentRepository subjectAssignmentRepository;
    private final DepartmentRepository departmentRepository;
    private final CourseRepository courseRepository;
    private final UserRepository userRepository;
    
    private final SubjectMapper subjectMapper;
    private final SubjectAssignmentMapper subjectAssignmentMapper;

    @Override
    @Transactional
    public SubjectResponse createSubject(SubjectRequest request) {
        if (subjectRepository.existsByCode(request.getCode())) {
            throw new DuplicateResourceException("Subject code already exists");
        }

        Department department = departmentRepository.findById(request.getDepartmentId())
                .orElseThrow(() -> new ResourceNotFoundException("Department", "id", request.getDepartmentId()));

        Course course = null;
        if (request.getCourseId() != null) {
            course = courseRepository.findById(request.getCourseId())
                    .orElseThrow(() -> new ResourceNotFoundException("Course", "id", request.getCourseId()));
        }

        Subject subject = subjectMapper.toEntity(request);
        subject.setDepartment(department);
        subject.setCourse(course);
        
        if (request.getIsActive() == null) {
            subject.setIsActive(true);
        }

        Subject savedSubject = subjectRepository.save(subject);
        return subjectMapper.toResponse(savedSubject);
    }

    @Override
    @Transactional
    public SubjectResponse updateSubject(Long id, SubjectRequest request) {
        Subject subject = subjectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Subject", "id", id));

        if (!subject.getCode().equals(request.getCode()) && subjectRepository.existsByCode(request.getCode())) {
            throw new DuplicateResourceException("Subject code already exists");
        }

        if (!subject.getDepartment().getId().equals(request.getDepartmentId())) {
            Department department = departmentRepository.findById(request.getDepartmentId())
                    .orElseThrow(() -> new ResourceNotFoundException("Department", "id", request.getDepartmentId()));
            subject.setDepartment(department);
        }

        if (request.getCourseId() != null) {
            if (subject.getCourse() == null || !subject.getCourse().getId().equals(request.getCourseId())) {
                Course course = courseRepository.findById(request.getCourseId())
                        .orElseThrow(() -> new ResourceNotFoundException("Course", "id", request.getCourseId()));
                subject.setCourse(course);
            }
        } else {
            subject.setCourse(null);
        }

        subjectMapper.updateEntityFromRequest(request, subject);
        if (request.getIsActive() != null) {
            subject.setIsActive(request.getIsActive());
        }

        Subject updatedSubject = subjectRepository.save(subject);
        return subjectMapper.toResponse(updatedSubject);
    }

    @Override
    @Transactional(readOnly = true)
    public SubjectResponse getSubjectById(Long id) {
        Subject subject = subjectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Subject", "id", id));
        return subjectMapper.toResponse(subject);
    }

    @Override
    @Transactional
    public void deleteSubject(Long id) {
        Subject subject = subjectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Subject", "id", id));
        subjectRepository.delete(subject);
    }

    @Override
    @Transactional(readOnly = true)
    public PageResponse<SubjectSummaryResponse> searchSubjects(String query, Long departmentId, Long courseId, Integer semester, Boolean isActive, int page, int size, String sortBy, String sortDir) {
        Sort sort = sortDir.equalsIgnoreCase(Sort.Direction.ASC.name()) ? Sort.by(sortBy).ascending()
                : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);

        Page<Subject> subjectPage = subjectRepository.search(query, departmentId, courseId, semester, isActive, pageable);
        
        PageResponse<SubjectSummaryResponse> response = new PageResponse<>();
        response.setContent(subjectPage.getContent().stream().map(subjectMapper::toSummaryResponse).collect(Collectors.toList()));
        response.setPageNo(subjectPage.getNumber());
        response.setPageSize(subjectPage.getSize());
        response.setTotalElements(subjectPage.getTotalElements());
        response.setTotalPages(subjectPage.getTotalPages());
        response.setLast(subjectPage.isLast());
        
        return response;
    }

    @Override
    @Transactional
    public SubjectAssignmentResponse assignProfessor(SubjectAssignmentRequest request) {
        subjectAssignmentRepository.findBySubjectIdAndProfessorIdAndAcademicYearAndSemester(
                request.getSubjectId(), request.getProfessorId(), request.getAcademicYear(), request.getSemester()
        ).ifPresent(a -> {
            throw new DuplicateResourceException("Professor is already assigned to this subject for given year and semester");
        });

        Subject subject = subjectRepository.findById(request.getSubjectId())
                .orElseThrow(() -> new ResourceNotFoundException("Subject", "id", request.getSubjectId()));
        
        User professor = userRepository.findById(request.getProfessorId())
                .orElseThrow(() -> new ResourceNotFoundException("User (Professor)", "id", request.getProfessorId()));

        SubjectAssignment assignment = subjectAssignmentMapper.toEntity(request);
        assignment.setSubject(subject);
        assignment.setProfessor(professor);

        SubjectAssignment savedAssignment = subjectAssignmentRepository.save(assignment);
        return subjectAssignmentMapper.toResponse(savedAssignment);
    }

    @Override
    @Transactional(readOnly = true)
    public List<SubjectAssignmentResponse> getAssignmentsBySubject(Long subjectId) {
        return subjectAssignmentRepository.findBySubjectId(subjectId).stream()
                .map(subjectAssignmentMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void deleteAssignment(Long assignmentId) {
        SubjectAssignment assignment = subjectAssignmentRepository.findById(assignmentId)
                .orElseThrow(() -> new ResourceNotFoundException("SubjectAssignment", "id", assignmentId));
        subjectAssignmentRepository.delete(assignment);
    }
}
