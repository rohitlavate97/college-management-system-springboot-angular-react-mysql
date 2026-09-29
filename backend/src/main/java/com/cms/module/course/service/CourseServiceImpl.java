package com.cms.module.course.service;

import com.cms.common.PageResponse;
import com.cms.exception.DuplicateResourceException;
import com.cms.exception.ResourceNotFoundException;
import com.cms.module.course.dto.CourseRequest;
import com.cms.module.course.dto.CourseResponse;
import com.cms.module.course.dto.CourseSummaryResponse;
import com.cms.module.course.entity.Course;
import com.cms.module.course.mapper.CourseMapper;
import com.cms.module.course.repository.CourseRepository;
import com.cms.module.department.entity.Department;
import com.cms.module.department.repository.DepartmentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class CourseServiceImpl implements CourseService {

    private final CourseRepository courseRepository;
    private final DepartmentRepository departmentRepository;
    private final CourseMapper courseMapper;

    @Override
    @Transactional
    public CourseResponse createCourse(CourseRequest request) {
        if (courseRepository.existsByCode(request.getCode())) {
            throw new DuplicateResourceException("Course code already exists");
        }

        Department department = departmentRepository.findById(request.getDepartmentId())
                .orElseThrow(() -> new ResourceNotFoundException("Department", "id", request.getDepartmentId()));

        Course course = courseMapper.toEntity(request);
        course.setDepartment(department);
        if (request.getIsActive() == null) {
            course.setIsActive(true);
        }

        Course savedCourse = courseRepository.save(course);
        return courseMapper.toResponse(savedCourse);
    }

    @Override
    @Transactional
    public CourseResponse updateCourse(Long id, CourseRequest request) {
        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Course", "id", id));

        if (!course.getCode().equals(request.getCode()) && courseRepository.existsByCode(request.getCode())) {
            throw new DuplicateResourceException("Course code already exists");
        }

        if (!course.getDepartment().getId().equals(request.getDepartmentId())) {
            Department department = departmentRepository.findById(request.getDepartmentId())
                    .orElseThrow(() -> new ResourceNotFoundException("Department", "id", request.getDepartmentId()));
            course.setDepartment(department);
        }

        courseMapper.updateEntityFromRequest(request, course);
        if (request.getIsActive() != null) {
            course.setIsActive(request.getIsActive());
        }

        Course updatedCourse = courseRepository.save(course);
        return courseMapper.toResponse(updatedCourse);
    }

    @Override
    @Transactional(readOnly = true)
    public CourseResponse getCourseById(Long id) {
        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Course", "id", id));
        return courseMapper.toResponse(course);
    }

    @Override
    @Transactional
    public void deleteCourse(Long id) {
        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Course", "id", id));
        courseRepository.delete(course);
    }

    @Override
    @Transactional(readOnly = true)
    public PageResponse<CourseSummaryResponse> searchCourses(String query, Long departmentId, Boolean isActive, int page, int size, String sortBy, String sortDir) {
        Sort sort = sortDir.equalsIgnoreCase(Sort.Direction.ASC.name()) ? Sort.by(sortBy).ascending()
                : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);

        Page<Course> coursePage = courseRepository.search(query, departmentId, isActive, pageable);
        
        PageResponse<CourseSummaryResponse> response = new PageResponse<>();
        response.setContent(coursePage.getContent().stream().map(courseMapper::toSummaryResponse).toList());
        response.setPageNo(coursePage.getNumber());
        response.setPageSize(coursePage.getSize());
        response.setTotalElements(coursePage.getTotalElements());
        response.setTotalPages(coursePage.getTotalPages());
        response.setLast(coursePage.isLast());
        
        return response;
    }
}
