package com.cms.module.attendance.service;

import com.cms.module.attendance.dto.AttendanceResponse;
import com.cms.module.attendance.dto.AttendanceStatsResponse;
import com.cms.module.attendance.dto.BatchAttendanceRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.LocalDate;
import java.util.List;

public interface AttendanceService {

    List<AttendanceResponse> markBatchAttendance(BatchAttendanceRequest request);

    Page<AttendanceResponse> getStudentAttendance(Long studentId, Pageable pageable);

    List<AttendanceResponse> getSubjectAttendance(Long subjectId, LocalDate date);

    AttendanceStatsResponse getStudentSubjectStats(Long studentId, Long subjectId);

    AttendanceStatsResponse getOverallStudentStats(Long studentId);
}
