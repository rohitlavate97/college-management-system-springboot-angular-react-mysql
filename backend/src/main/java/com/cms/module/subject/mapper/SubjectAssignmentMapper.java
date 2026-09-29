package com.cms.module.subject.mapper;

import com.cms.module.subject.dto.SubjectAssignmentRequest;
import com.cms.module.subject.dto.SubjectAssignmentResponse;
import com.cms.module.subject.entity.SubjectAssignment;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface SubjectAssignmentMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "version", ignore = true)
    @Mapping(target = "professor", ignore = true)
    @Mapping(target = "subject", ignore = true)
    SubjectAssignment toEntity(SubjectAssignmentRequest request);

    @Mapping(target = "professorId", source = "professor.id")
    @Mapping(target = "professorName", expression = "java(assignment.getProfessor().getFirstName() + ' ' + assignment.getProfessor().getLastName())")
    @Mapping(target = "subjectId", source = "subject.id")
    @Mapping(target = "subjectName", source = "subject.name")
    SubjectAssignmentResponse toResponse(SubjectAssignment assignment);
}
