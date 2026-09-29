package com.cms.module.subject.mapper;

import com.cms.module.subject.dto.SubjectRequest;
import com.cms.module.subject.dto.SubjectResponse;
import com.cms.module.subject.dto.SubjectSummaryResponse;
import com.cms.module.subject.entity.Subject;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface SubjectMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "version", ignore = true)
    @Mapping(target = "department", ignore = true)
    @Mapping(target = "course", ignore = true)
    Subject toEntity(SubjectRequest request);

    @Mapping(target = "departmentId", source = "department.id")
    @Mapping(target = "departmentName", source = "department.name")
    @Mapping(target = "courseId", source = "course.id")
    @Mapping(target = "courseName", source = "course.name")
    SubjectResponse toResponse(Subject subject);

    @Mapping(target = "departmentName", source = "department.name")
    @Mapping(target = "courseName", source = "course.name")
    SubjectSummaryResponse toSummaryResponse(Subject subject);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "version", ignore = true)
    @Mapping(target = "department", ignore = true)
    @Mapping(target = "course", ignore = true)
    void updateEntityFromRequest(SubjectRequest request, @MappingTarget Subject subject);
}
