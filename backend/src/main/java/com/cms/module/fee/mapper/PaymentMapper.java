package com.cms.module.fee.mapper;

import com.cms.module.fee.domain.entity.Payment;
import com.cms.module.fee.dto.response.PaymentResponse;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface PaymentMapper {
    @Mapping(target = "feeInvoiceId", source = "feeInvoice.id")
    @Mapping(target = "invoiceNumber", source = "feeInvoice.invoiceNumber")
    PaymentResponse toResponse(Payment entity);
}
