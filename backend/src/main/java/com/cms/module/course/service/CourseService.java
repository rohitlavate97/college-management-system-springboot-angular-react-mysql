package com.cms.module.course.service;

import com.cms.common.PageResponse;
import com.cms.module.course.dto.CourseRequest;
import com.cms.module.course.dto.CourseResponse;
import com.cms.module.course.dto.CourseSummaryResponse;

public interface CourseService {
    CourseResponse createCourse(CourseRequest request);
    CourseResponse updateCourse(Long id, CourseRequest request);
    CourseResponse getCourseById(Long id);
    void deleteCourse(Long id);
    PageResponse<CourseSummaryResponse> searchCourses(String query, Long departmentId, Boolean isActive, int page, int size, String sortBy, String sortDir);
}
