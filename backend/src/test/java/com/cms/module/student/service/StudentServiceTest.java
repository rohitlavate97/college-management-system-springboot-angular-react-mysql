package com.cms.module.student.service;

import com.cms.exception.DuplicateResourceException;
import com.cms.exception.ResourceNotFoundException;
import com.cms.module.course.entity.Course;
import com.cms.module.course.repository.CourseRepository;
import com.cms.module.department.entity.Department;
import com.cms.module.department.repository.DepartmentRepository;
import com.cms.module.student.dto.StudentProfileRequest;
import com.cms.module.student.dto.StudentRequest;
import com.cms.module.student.dto.StudentResponse;
import com.cms.module.student.entity.Student;
import com.cms.module.student.entity.StudentProfile;
import com.cms.module.student.mapper.StudentMapper;
import com.cms.module.student.repository.StudentRepository;
import com.cms.module.user.entity.Role;
import com.cms.module.user.entity.User;
import com.cms.module.user.repository.RoleRepository;
import com.cms.module.user.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class StudentServiceTest {

    @Mock
    private StudentRepository studentRepository;
    @Mock
    private UserRepository userRepository;
    @Mock
    private RoleRepository roleRepository;
    @Mock
    private DepartmentRepository departmentRepository;
    @Mock
    private CourseRepository courseRepository;
    @Mock
    private StudentMapper studentMapper;
    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private StudentServiceImpl studentService;

    private StudentRequest request;
    private Department department;
    private Course course;
    private Role studentRole;
    private User user;
    private Student student;
    private StudentResponse response;

    @BeforeEach
    void setUp() {
        request = new StudentRequest();
        request.setRollNumber("STU001");
        request.setEmail("stu001@example.com");
        request.setFirstName("John");
        request.setLastName("Doe");
        request.setDepartmentId(1L);
        request.setCourseId(1L);

        department = new Department();
        department.setId(1L);

        course = new Course();
        course.setId(1L);

        studentRole = new Role();
        studentRole.setName("ROLE_STUDENT");

        user = new User();
        user.setId(1L);

        student = new Student();
        student.setId(1L);

        response = new StudentResponse();
        response.setId(1L);
        response.setRollNumber("STU001");
    }

    @Test
    void createStudent_Success() {
        when(studentRepository.findByRollNumber("STU001")).thenReturn(Optional.empty());
        when(userRepository.findByEmail("stu001@example.com")).thenReturn(Optional.empty());
        when(departmentRepository.findById(1L)).thenReturn(Optional.of(department));
        when(courseRepository.findById(1L)).thenReturn(Optional.of(course));
        when(passwordEncoder.encode(anyString())).thenReturn("encodedPassword");
        when(roleRepository.findByName("ROLE_STUDENT")).thenReturn(Optional.of(studentRole));
        when(userRepository.save(any(User.class))).thenReturn(user);
        when(studentMapper.toEntity(request)).thenReturn(student);
        when(studentRepository.save(any(Student.class))).thenReturn(student);
        when(studentMapper.toResponse(student)).thenReturn(response);

        StudentResponse result = studentService.createStudent(request);

        assertNotNull(result);
        assertEquals("STU001", result.getRollNumber());
        verify(userRepository).save(any(User.class));
        verify(studentRepository).save(any(Student.class));
    }

    @Test
    void createStudent_WithProfile_Success() {
        request.setProfile(new StudentProfileRequest());
        StudentProfile profile = new StudentProfile();
        
        when(studentRepository.findByRollNumber("STU001")).thenReturn(Optional.empty());
        when(userRepository.findByEmail("stu001@example.com")).thenReturn(Optional.empty());
        when(departmentRepository.findById(1L)).thenReturn(Optional.of(department));
        when(courseRepository.findById(1L)).thenReturn(Optional.of(course));
        when(passwordEncoder.encode(anyString())).thenReturn("encodedPassword");
        when(roleRepository.findByName("ROLE_STUDENT")).thenReturn(Optional.of(studentRole));
        when(userRepository.save(any(User.class))).thenReturn(user);
        when(studentMapper.toEntity(request)).thenReturn(student);
        when(studentMapper.toProfileEntity(any(StudentProfileRequest.class))).thenReturn(profile);
        when(studentRepository.save(any(Student.class))).thenReturn(student);
        when(studentMapper.toResponse(student)).thenReturn(response);

        StudentResponse result = studentService.createStudent(request);

        assertNotNull(result);
        verify(studentMapper).toProfileEntity(any(StudentProfileRequest.class));
    }

    @Test
    void createStudent_DuplicateRollNumber_ThrowsException() {
        when(studentRepository.findByRollNumber("STU001")).thenReturn(Optional.of(student));

        assertThrows(DuplicateResourceException.class, () -> studentService.createStudent(request));
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    void createStudent_DuplicateEmail_ThrowsException() {
        when(studentRepository.findByRollNumber("STU001")).thenReturn(Optional.empty());
        when(userRepository.findByEmail("stu001@example.com")).thenReturn(Optional.of(user));

        assertThrows(DuplicateResourceException.class, () -> studentService.createStudent(request));
        verify(studentRepository, never()).save(any(Student.class));
    }
}
