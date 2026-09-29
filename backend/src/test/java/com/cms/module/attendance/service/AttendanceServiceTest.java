package com.cms.module.attendance.service;

import com.cms.exception.ResourceNotFoundException;
import com.cms.module.attendance.dto.AttendanceResponse;
import com.cms.module.attendance.dto.AttendanceStatsResponse;
import com.cms.module.attendance.dto.BatchAttendanceRequest;
import com.cms.module.attendance.dto.AttendanceRecordRequest;
import com.cms.module.attendance.entity.Attendance;
import com.cms.module.attendance.entity.AttendanceStatus;
import com.cms.module.attendance.mapper.AttendanceMapper;
import com.cms.module.attendance.repository.AttendanceRepository;
import com.cms.module.attendance.service.impl.AttendanceServiceImpl;
import com.cms.module.professor.entity.Professor;
import com.cms.module.professor.repository.ProfessorRepository;
import com.cms.module.student.entity.Student;
import com.cms.module.student.repository.StudentRepository;
import com.cms.module.subject.entity.Subject;
import com.cms.module.subject.repository.SubjectRepository;
import com.cms.module.user.entity.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AttendanceServiceTest {

    @Mock
    private AttendanceRepository attendanceRepository;
    @Mock
    private StudentRepository studentRepository;
    @Mock
    private SubjectRepository subjectRepository;
    @Mock
    private ProfessorRepository professorRepository;
    @Mock
    private AttendanceMapper attendanceMapper;

    @InjectMocks
    private AttendanceServiceImpl attendanceService;

    private Student student;
    private Subject subject;
    private Professor professor;
    private BatchAttendanceRequest batchRequest;
    private Attendance attendance;

    @BeforeEach
    void setUp() {
        User user = new User();
        user.setFirstName("John");
        user.setLastName("Doe");

        student = new Student();
        student.setId(1L);
        student.setUser(user);

        subject = new Subject();
        subject.setId(1L);
        subject.setName("Math");

        professor = new Professor();
        professor.setId(1L);

        AttendanceRecordRequest record = new AttendanceRecordRequest();
        record.setStudentId(1L);
        record.setStatus(AttendanceStatus.PRESENT);

        batchRequest = new BatchAttendanceRequest();
        batchRequest.setSubjectId(1L);
        batchRequest.setProfessorId(1L);
        batchRequest.setAttendanceDate(LocalDate.now());
        batchRequest.setRecords(List.of(record));

        attendance = Attendance.builder()
                .student(student)
                .subject(subject)
                .professor(professor)
                .attendanceDate(LocalDate.now())
                .status(AttendanceStatus.PRESENT)
                .build();
    }

    @Test
    void markBatchAttendance_Success() {
        when(subjectRepository.findById(1L)).thenReturn(Optional.of(subject));
        when(professorRepository.findById(1L)).thenReturn(Optional.of(professor));
        when(studentRepository.findById(1L)).thenReturn(Optional.of(student));
        when(attendanceRepository.findByStudentIdAndSubjectIdAndAttendanceDate(1L, 1L, batchRequest.getAttendanceDate()))
                .thenReturn(Optional.empty());
        
        when(attendanceRepository.saveAll(any())).thenReturn(List.of(attendance));
        
        AttendanceResponse response = new AttendanceResponse();
        response.setStatus(AttendanceStatus.PRESENT);
        when(attendanceMapper.toDto(any(Attendance.class))).thenReturn(response);

        List<AttendanceResponse> result = attendanceService.markBatchAttendance(batchRequest);

        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(AttendanceStatus.PRESENT, result.get(0).getStatus());
        verify(attendanceRepository).saveAll(any());
    }

    @Test
    void markBatchAttendance_SubjectNotFound_ThrowsException() {
        when(subjectRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> attendanceService.markBatchAttendance(batchRequest));
        verify(attendanceRepository, never()).saveAll(any());
    }

    @Test
    void getStudentSubjectStats_Calculation_Success() {
        when(studentRepository.findById(1L)).thenReturn(Optional.of(student));
        when(subjectRepository.findById(1L)).thenReturn(Optional.of(subject));
        when(attendanceRepository.countTotalClassesByStudentAndSubject(1L, 1L)).thenReturn(10L);
        when(attendanceRepository.countAttendedClassesByStudentAndSubject(1L, 1L)).thenReturn(8L);

        AttendanceStatsResponse result = attendanceService.getStudentSubjectStats(1L, 1L);

        assertNotNull(result);
        assertEquals(10L, result.getTotalClasses());
        assertEquals(8L, result.getAttendedClasses());
        assertEquals(80.0, result.getAttendancePercentage());
    }

    @Test
    void getOverallStudentStats_ZeroClasses_HandlesDivisionByZero() {
        when(studentRepository.findById(1L)).thenReturn(Optional.of(student));
        when(attendanceRepository.countTotalClassesByStudent(1L)).thenReturn(0L);
        when(attendanceRepository.countAttendedClassesByStudent(1L)).thenReturn(0L);

        AttendanceStatsResponse result = attendanceService.getOverallStudentStats(1L);

        assertNotNull(result);
        assertEquals(0L, result.getTotalClasses());
        assertEquals(0.0, result.getAttendancePercentage());
    }
}
