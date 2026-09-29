package com.cms.module.student.mapper;

import com.cms.module.student.dto.*;
import com.cms.module.student.entity.Guardian;
import com.cms.module.student.entity.Student;
import com.cms.module.student.entity.StudentProfile;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface StudentMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "user", ignore = true)
    @Mapping(target = "department", ignore = true)
    @Mapping(target = "course", ignore = true)
    @Mapping(target = "status", ignore = true)
    @Mapping(target = "profile", ignore = true)
    @Mapping(target = "guardians", ignore = true)
    Student toEntity(StudentRequest request);

    @Mapping(source = "user.id", target = "userId")
    @Mapping(source = "user.firstName", target = "firstName")
    @Mapping(source = "user.lastName", target = "lastName")
    @Mapping(source = "user.email", target = "email")
    @Mapping(source = "user.phone", target = "phone")
    @Mapping(source = "department.id", target = "departmentId")
    @Mapping(source = "department.name", target = "departmentName")
    @Mapping(source = "course.id", target = "courseId")
    @Mapping(source = "course.name", target = "courseName")
    StudentResponse toResponse(Student student);

    @Mapping(source = "user.firstName", target = "firstName")
    @Mapping(source = "user.lastName", target = "lastName")
    @Mapping(source = "department.name", target = "departmentName")
    @Mapping(source = "course.name", target = "courseName")
    StudentSummaryResponse toSummaryResponse(Student student);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "student", ignore = true)
    StudentProfile toProfileEntity(StudentProfileRequest request);
    
    StudentProfileResponse toProfileResponse(StudentProfile profile);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "student", ignore = true)
    Guardian toGuardianEntity(GuardianRequest request);
    
    GuardianResponse toGuardianResponse(Guardian guardian);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "user", ignore = true)
    @Mapping(target = "department", ignore = true)
    @Mapping(target = "course", ignore = true)
    @Mapping(target = "status", ignore = true)
    @Mapping(target = "profile", ignore = true)
    @Mapping(target = "guardians", ignore = true)
    @Mapping(target = "rollNumber", ignore = true)
    @Mapping(target = "registrationNumber", ignore = true)
    void updateEntityFromRequest(StudentRequest request, @MappingTarget Student student);
    
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "student", ignore = true)
    void updateProfileFromRequest(StudentProfileRequest request, @MappingTarget StudentProfile profile);
}
