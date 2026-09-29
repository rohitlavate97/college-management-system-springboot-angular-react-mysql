package com.cms.module.student.mapper;

import com.cms.module.student.dto.EnrollmentRequest;
import com.cms.module.student.dto.EnrollmentResponse;
import com.cms.module.student.entity.Enrollment;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface EnrollmentMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "student", ignore = true)
    @Mapping(target = "subject", ignore = true)
    @Mapping(target = "status", ignore = true)
    @Mapping(target = "droppedDate", ignore = true)
    @Mapping(target = "dropReason", ignore = true)
    Enrollment toEntity(EnrollmentRequest request);

    @Mapping(source = "student.id", target = "studentId")
    @Mapping(source = "student.user.firstName", target = "studentName")
    @Mapping(source = "student.rollNumber", target = "rollNumber")
    @Mapping(source = "subject.id", target = "subjectId")
    @Mapping(source = "subject.name", target = "subjectName")
    @Mapping(source = "subject.code", target = "subjectCode")
    EnrollmentResponse toResponse(Enrollment enrollment);
}
