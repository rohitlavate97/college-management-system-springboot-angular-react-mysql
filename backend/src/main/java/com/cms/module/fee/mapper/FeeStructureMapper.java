package com.cms.module.fee.mapper;

import com.cms.module.fee.domain.entity.FeeStructure;
import com.cms.module.fee.dto.request.FeeStructureRequest;
import com.cms.module.fee.dto.response.FeeStructureResponse;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface FeeStructureMapper {
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "course", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    
    
    @Mapping(target = "version", ignore = true)
    FeeStructure toEntity(FeeStructureRequest request);

    @Mapping(target = "courseId", source = "course.id")
    @Mapping(target = "courseName", source = "course.name")
    FeeStructureResponse toResponse(FeeStructure entity);
}
