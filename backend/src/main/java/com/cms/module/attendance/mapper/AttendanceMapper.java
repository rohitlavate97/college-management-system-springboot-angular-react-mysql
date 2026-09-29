package com.cms.module.attendance.mapper;

import com.cms.module.attendance.dto.AttendanceResponse;
import com.cms.module.attendance.entity.Attendance;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface AttendanceMapper {

    @Mapping(target = "studentId", source = "student.id")
    @Mapping(target = "studentName", expression = "java(attendance.getStudent().getUser().getFirstName() + ' ' + attendance.getStudent().getUser().getLastName())")
    @Mapping(target = "rollNumber", source = "student.rollNumber")
    @Mapping(target = "subjectId", source = "subject.id")
    @Mapping(target = "subjectName", source = "subject.name")
    @Mapping(target = "professorId", source = "professor.id")
    @Mapping(target = "professorName", expression = "java(attendance.getProfessor().getUser().getFirstName() + ' ' + attendance.getProfessor().getUser().getLastName())")
    AttendanceResponse toDto(Attendance attendance);
}
