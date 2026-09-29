package com.cms.module.examination.service;

import com.cms.module.examination.dto.ResultEntryRequest;
import com.cms.module.examination.dto.ResultResponse;
import com.cms.module.examination.dto.StudentReportCardResponse;

import java.util.List;

public interface ResultService {
    List<ResultResponse> enterMarks(ResultEntryRequest request, String currentUserEmail);
    List<ResultResponse> getResultsForExamSubject(Long examSubjectId);
    void publishResults(Long examinationId);
    StudentReportCardResponse getStudentReportCard(Long studentId, Long examinationId);
    List<StudentReportCardResponse> getStudentAllReportCards(Long studentId);
}
