package com.cms.module.fee.mapper;

import com.cms.module.fee.domain.entity.FeeInvoice;
import com.cms.module.fee.dto.response.FeeInvoiceResponse;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface FeeInvoiceMapper {
    @Mapping(target = "studentId", source = "student.id")
    @Mapping(target = "studentName", expression = "java(entity.getStudent().getUser().getFirstName() + ' ' + entity.getStudent().getUser().getLastName())")
    @Mapping(target = "feeStructureId", source = "feeStructure.id")
    @Mapping(target = "feeStructureName", source = "feeStructure.name")
    FeeInvoiceResponse toResponse(FeeInvoice entity);
}
