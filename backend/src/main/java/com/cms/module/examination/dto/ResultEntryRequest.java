package com.cms.module.examination.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
public class ResultEntryRequest {
    @NotNull
    private Long examSubjectId;
    
    @NotNull
    private List<StudentMark> marks;

    @Data
    public static class StudentMark {
        @NotNull
        private Long studentId;
        private BigDecimal marksObtained;
        private String remarks;
    }
}
