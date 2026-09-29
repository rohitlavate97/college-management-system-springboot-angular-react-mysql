package com.cms.module.student.service;

import com.cms.exception.DuplicateResourceException;
import com.cms.exception.ResourceNotFoundException;
import com.cms.exception.BusinessException;
import com.cms.module.course.entity.Course;
import com.cms.module.course.repository.CourseRepository;
import com.cms.module.department.entity.Department;
import com.cms.module.department.repository.DepartmentRepository;
import com.cms.module.student.dto.*;
import com.cms.module.student.entity.*;
import com.cms.module.student.mapper.EnrollmentMapper;
import com.cms.module.student.mapper.StudentMapper;
import com.cms.module.student.repository.EnrollmentRepository;
import com.cms.module.student.repository.StudentRepository;
import com.cms.module.subject.entity.Subject;
import com.cms.module.subject.repository.SubjectRepository;
import com.cms.module.user.entity.Role;
import com.cms.module.user.entity.User;
import com.cms.module.user.repository.RoleRepository;
import com.cms.module.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class StudentServiceImpl implements StudentService {

    private final StudentRepository studentRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final DepartmentRepository departmentRepository;
    private final CourseRepository courseRepository;
    private final SubjectRepository subjectRepository;
    private final StudentMapper studentMapper;
    private final EnrollmentMapper enrollmentMapper;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public StudentResponse createStudent(StudentRequest request) {
        if (studentRepository.findByRollNumber(request.getRollNumber()).isPresent()) {
            throw new DuplicateResourceException("Student with roll number " + request.getRollNumber() + " already exists");
        }
        if (studentRepository.findByRegistrationNumber(request.getRegistrationNumber()).isPresent()) {
            throw new DuplicateResourceException("Student with registration number " + request.getRegistrationNumber() + " already exists");
        }
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new DuplicateResourceException("User with email " + request.getEmail() + " already exists");
        }

        Department department = departmentRepository.findById(request.getDepartmentId())
                .orElseThrow(() -> new ResourceNotFoundException("Department not found"));
        Course course = courseRepository.findById(request.getCourseId())
                .orElseThrow(() -> new ResourceNotFoundException("Course not found"));

        User user = new User();
        user.setUsername(request.getRollNumber());
        user.setEmail(request.getEmail());
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setPhone(request.getPhone());
        user.setPasswordHash(passwordEncoder.encode(request.getRollNumber())); // Default password as roll number
        user.setIsActive(true);
        user.setIsEmailVerified(true);
        
        Role studentRole = roleRepository.findByName("ROLE_STUDENT")
                .orElseThrow(() -> new ResourceNotFoundException("Role ROLE_STUDENT not found"));
        user.getRoles().add(studentRole);
        
        user = userRepository.save(user);

        Student student = studentMapper.toEntity(request);
        student.setUser(user);
        student.setDepartment(department);
        student.setCourse(course);
        student.setStatus(StudentStatus.ACTIVE);

        if (request.getProfile() != null) {
            StudentProfile profile = studentMapper.toProfileEntity(request.getProfile());
            student.setProfile(profile);
        } else {
            StudentProfile profile = new StudentProfile();
            student.setProfile(profile);
        }

        if (request.getGuardians() != null) {
            request.getGuardians().forEach(g -> {
                Guardian guardian = studentMapper.toGuardianEntity(g);
                student.addGuardian(guardian);
            });
        }

        Student savedStudent = studentRepository.save(student);
        return studentMapper.toResponse(savedStudent);
    }

    @Override
    public StudentResponse getStudentById(Long id) {
        return studentRepository.findById(id)
                .map(studentMapper::toResponse)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found"));
    }

    @Override
    public StudentResponse getStudentByRollNumber(String rollNumber) {
        return studentRepository.findByRollNumber(rollNumber)
                .map(studentMapper::toResponse)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found"));
    }

    @Override
    public Page<StudentSummaryResponse> getAllStudents(int page, int size, String sortBy, String sortDir) {
        Sort sort = sortDir.equalsIgnoreCase(Sort.Direction.ASC.name()) ? Sort.by(sortBy).ascending()
                : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);
        return studentRepository.findAll(pageable).map(studentMapper::toSummaryResponse);
    }

    @Override
    public Page<StudentSummaryResponse> getStudentsByDepartment(Long departmentId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return studentRepository.findByDepartmentId(departmentId, pageable).map(studentMapper::toSummaryResponse);
    }

    @Override
    public Page<StudentSummaryResponse> getStudentsByCourse(Long courseId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return studentRepository.findByCourseId(courseId, pageable).map(studentMapper::toSummaryResponse);
    }

    @Override
    public Page<StudentSummaryResponse> searchStudents(String query, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return studentRepository.search(query, pageable).map(studentMapper::toSummaryResponse);
    }

    @Override
    @Transactional
    public StudentResponse updateStudent(Long id, StudentRequest request) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found"));
        
        if (!student.getRollNumber().equals(request.getRollNumber()) && studentRepository.findByRollNumber(request.getRollNumber()).isPresent()) {
            throw new DuplicateResourceException("Student with roll number " + request.getRollNumber() + " already exists");
        }

        Department department = departmentRepository.findById(request.getDepartmentId())
                .orElseThrow(() -> new ResourceNotFoundException("Department not found"));
        Course course = courseRepository.findById(request.getCourseId())
                .orElseThrow(() -> new ResourceNotFoundException("Course not found"));

        studentMapper.updateEntityFromRequest(request, student);
        student.setDepartment(department);
        student.setCourse(course);

        User user = student.getUser();
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setPhone(request.getPhone());
        if (!user.getEmail().equals(request.getEmail())) {
            if (userRepository.findByEmail(request.getEmail()).isPresent()) {
                throw new DuplicateResourceException("User with email " + request.getEmail() + " already exists");
            }
            user.setEmail(request.getEmail());
        }
        userRepository.save(user);

        if (request.getProfile() != null) {
            if (student.getProfile() == null) {
                student.setProfile(new StudentProfile());
            }
            studentMapper.updateProfileFromRequest(request.getProfile(), student.getProfile());
        }

        Student updatedStudent = studentRepository.save(student);
        return studentMapper.toResponse(updatedStudent);
    }

    @Override
    @Transactional
    public StudentResponse updateStudentStatus(Long id, String status) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found"));
        try {
            student.setStatus(StudentStatus.valueOf(status.toUpperCase()));
        } catch (IllegalArgumentException e) {
            throw new BusinessException("Invalid status: " + status);
        }
        student = studentRepository.save(student);
        return studentMapper.toResponse(student);
    }

    @Override
    @Transactional
    public void deleteStudent(Long id) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found"));
        studentRepository.delete(student);
    }

    @Override
    @Transactional
    public EnrollmentResponse enrollStudent(Long studentId, EnrollmentRequest request) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found"));
        Subject subject = subjectRepository.findById(request.getSubjectId())
                .orElseThrow(() -> new ResourceNotFoundException("Subject not found"));

        if (enrollmentRepository.existsByStudentIdAndSubjectIdAndAcademicYearAndSemester(
                studentId, subject.getId(), request.getAcademicYear(), request.getSemester())) {
            throw new DuplicateResourceException("Student is already enrolled in this subject for given year and semester");
        }

        Enrollment enrollment = enrollmentMapper.toEntity(request);
        enrollment.setStudent(student);
        enrollment.setSubject(subject);
        enrollment.setStatus(EnrollmentStatus.ACTIVE);

        Enrollment saved = enrollmentRepository.save(enrollment);
        return enrollmentMapper.toResponse(saved);
    }

    @Override
    public List<EnrollmentResponse> getStudentEnrollments(Long studentId) {
        if (!studentRepository.existsById(studentId)) {
            throw new ResourceNotFoundException("Student not found");
        }
        return enrollmentRepository.findByStudentId(studentId).stream()
                .map(enrollmentMapper::toResponse)
                .collect(Collectors.toList());
    }
}
