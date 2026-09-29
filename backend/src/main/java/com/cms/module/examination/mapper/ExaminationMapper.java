package com.cms.module.examination.mapper;

import com.cms.module.examination.dto.ExaminationRequest;
import com.cms.module.examination.dto.ExaminationResponse;
import com.cms.module.examination.entity.Examination;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface ExaminationMapper {
    Examination toEntity(ExaminationRequest request);
    ExaminationResponse toResponse(Examination entity);
    void updateEntityFromRequest(ExaminationRequest request, @MappingTarget Examination entity);
}
