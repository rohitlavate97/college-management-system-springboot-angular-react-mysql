package com.cms.module.professor.mapper;

import com.cms.module.professor.dto.ProfessorRequest;
import com.cms.module.professor.dto.ProfessorResponse;
import com.cms.module.professor.dto.ProfessorSummaryResponse;
import com.cms.module.professor.entity.Professor;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface ProfessorMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "version", ignore = true)
    @Mapping(target = "user", ignore = true)
    @Mapping(target = "department", ignore = true)
    Professor toEntity(ProfessorRequest request);

    @Mapping(target = "userId", source = "user.id")
    @Mapping(target = "firstName", source = "user.firstName")
    @Mapping(target = "lastName", source = "user.lastName")
    @Mapping(target = "email", source = "user.email")
    @Mapping(target = "phone", source = "user.phone")
    @Mapping(target = "departmentId", source = "department.id")
    @Mapping(target = "departmentName", source = "department.name")
    ProfessorResponse toResponse(Professor professor);

    @Mapping(target = "fullName", expression = "java(professor.getUser().getFirstName() + \" \" + professor.getUser().getLastName())")
    @Mapping(target = "email", source = "user.email")
    @Mapping(target = "departmentName", source = "department.name")
    ProfessorSummaryResponse toSummaryResponse(Professor professor);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "version", ignore = true)
    @Mapping(target = "user", ignore = true)
    @Mapping(target = "department", ignore = true)
    void updateEntityFromRequest(ProfessorRequest request, @MappingTarget Professor professor);
}
