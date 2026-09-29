package com.cms.module.examination.mapper;

import com.cms.module.examination.dto.ResultResponse;
import com.cms.module.examination.entity.Result;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface ResultMapper {

    @Mapping(source = "student.id", target = "studentId")
    @Mapping(source = "student.user.firstName", target = "studentName")
    @Mapping(source = "student.rollNumber", target = "rollNumber")
    @Mapping(source = "examSubject.id", target = "examSubjectId")
    @Mapping(source = "examSubject.subject.name", target = "subjectName")
    @Mapping(source = "grade.grade", target = "grade")
    @Mapping(source = "grade.gradePoint", target = "gradePoint")
    ResultResponse toResponse(Result entity);
}
