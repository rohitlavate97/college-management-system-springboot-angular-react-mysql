package com.cms.module.college.mapper;

import com.cms.module.college.dto.CollegeRequest;
import com.cms.module.college.dto.CollegeResponse;
import com.cms.module.college.dto.CollegeSummaryResponse;
import com.cms.module.college.entity.College;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

@Mapper(componentModel = "spring", nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface CollegeMapper {
    CollegeResponse toResponse(College college);
    CollegeSummaryResponse toSummaryResponse(College college);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "version", ignore = true)
    @Mapping(target = "departments", ignore = true)
    College toEntity(CollegeRequest request);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "version", ignore = true)
    @Mapping(target = "departments", ignore = true)
    void updateEntityFromRequest(CollegeRequest request, @MappingTarget College college);
}
