package com.cms.module.course.mapper;

import com.cms.module.course.dto.CourseRequest;
import com.cms.module.course.dto.CourseResponse;
import com.cms.module.course.dto.CourseSummaryResponse;
import com.cms.module.course.entity.Course;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface CourseMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "version", ignore = true)
    @Mapping(target = "department", ignore = true)
    Course toEntity(CourseRequest request);

    @Mapping(target = "departmentId", source = "department.id")
    @Mapping(target = "departmentName", source = "department.name")
    CourseResponse toResponse(Course course);

    @Mapping(target = "departmentName", source = "department.name")
    CourseSummaryResponse toSummaryResponse(Course course);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "version", ignore = true)
    @Mapping(target = "department", ignore = true)
    void updateEntityFromRequest(CourseRequest request, @MappingTarget Course course);
}
