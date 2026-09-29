package com.cms.module.department.mapper;

import com.cms.module.department.dto.DepartmentRequest;
import com.cms.module.department.dto.DepartmentResponse;
import com.cms.module.department.dto.DepartmentSummaryResponse;
import com.cms.module.department.entity.Department;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

@Mapper(componentModel = "spring", nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface DepartmentMapper {
    @Mapping(target = "collegeId", source = "college.id")
    @Mapping(target = "collegeName", source = "college.name")
    DepartmentResponse toResponse(Department department);

    @Mapping(target = "collegeId", source = "college.id")
    @Mapping(target = "collegeName", source = "college.name")
    DepartmentSummaryResponse toSummaryResponse(Department department);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "version", ignore = true)
    @Mapping(target = "college", ignore = true)
    Department toEntity(DepartmentRequest request);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "version", ignore = true)
    @Mapping(target = "college", ignore = true)
    void updateEntityFromRequest(DepartmentRequest request, @MappingTarget Department department);
}
