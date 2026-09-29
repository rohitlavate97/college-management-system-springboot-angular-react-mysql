package com.cms.module.examination.mapper;

import com.cms.module.examination.dto.ExamSubjectRequest;
import com.cms.module.examination.dto.ExamSubjectResponse;
import com.cms.module.examination.entity.ExamSubject;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface ExamSubjectMapper {

    @Mapping(target = "subject", ignore = true)
    @Mapping(target = "examination", ignore = true)
    ExamSubject toEntity(ExamSubjectRequest request);

    @Mapping(source = "examination.id", target = "examinationId")
    @Mapping(source = "subject.id", target = "subjectId")
    @Mapping(source = "subject.name", target = "subjectName")
    @Mapping(source = "subject.code", target = "subjectCode")
    ExamSubjectResponse toResponse(ExamSubject entity);

    @Mapping(target = "subject", ignore = true)
    @Mapping(target = "examination", ignore = true)
    void updateEntityFromRequest(ExamSubjectRequest request, @MappingTarget ExamSubject entity);
}
