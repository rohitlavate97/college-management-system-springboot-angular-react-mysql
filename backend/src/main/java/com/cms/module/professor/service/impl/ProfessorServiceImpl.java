package com.cms.module.professor.service.impl;

import com.cms.common.PageResponse;
import com.cms.module.department.entity.Department;
import com.cms.module.department.repository.DepartmentRepository;
import com.cms.module.professor.dto.ProfessorRequest;
import com.cms.module.professor.dto.ProfessorResponse;
import com.cms.module.professor.dto.ProfessorSummaryResponse;
import com.cms.module.professor.entity.Professor;
import com.cms.module.professor.mapper.ProfessorMapper;
import com.cms.module.professor.repository.ProfessorRepository;
import com.cms.module.professor.service.ProfessorService;
import com.cms.module.user.entity.Role;
import com.cms.module.user.entity.User;
import com.cms.module.user.repository.RoleRepository;
import com.cms.module.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProfessorServiceImpl implements ProfessorService {

    private final ProfessorRepository professorRepository;
    private final ProfessorMapper professorMapper;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final DepartmentRepository departmentRepository;

    @Override
    @Transactional
    public ProfessorResponse createProfessor(ProfessorRequest request) {
        if (professorRepository.existsByEmployeeId(request.getEmployeeId())) {
            throw new RuntimeException("Employee ID already exists");
        }

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        Department department = departmentRepository.findById(request.getDepartmentId())
                .orElseThrow(() -> new RuntimeException("Department not found"));

        Role role = roleRepository.findByName("ROLE_PROFESSOR")
                .orElseGet(() -> {
                    Role newRole = new Role();
                    newRole.setName("ROLE_PROFESSOR");
                    return roleRepository.save(newRole);
                });

        User user = new User();
        user.setUsername(request.getEmployeeId());
        user.setEmail(request.getEmail());
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setPhone(request.getPhone());
        user.setPasswordHash("TEMP_HASH"); // In real app, generate and hash a random password
        user.getRoles().add(role);
        
        user = userRepository.save(user);

        Professor professor = professorMapper.toEntity(request);
        professor.setUser(user);
        professor.setDepartment(department);
        
        professor = professorRepository.save(professor);
        return professorMapper.toResponse(professor);
    }

    @Override
    public ProfessorResponse getProfessorById(Long id) {
        Professor professor = professorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Professor not found"));
        return professorMapper.toResponse(professor);
    }

    @Override
    public ProfessorResponse getProfessorByEmployeeId(String employeeId) {
        Professor professor = professorRepository.findByEmployeeId(employeeId)
                .orElseThrow(() -> new RuntimeException("Professor not found"));
        return professorMapper.toResponse(professor);
    }

    @Override
    public PageResponse<ProfessorSummaryResponse> getAllProfessors(int page, int size, String sortBy, String sortDir) {
        Sort sort = sortDir.equalsIgnoreCase(Sort.Direction.ASC.name()) ? Sort.by(sortBy).ascending()
                : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);
        Page<Professor> professors = professorRepository.findAll(pageable);
        return mapToPageResponse(professors);
    }

    @Override
    public PageResponse<ProfessorSummaryResponse> getProfessorsByDepartment(Long departmentId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Professor> professors = professorRepository.findByDepartmentId(departmentId, pageable);
        return mapToPageResponse(professors);
    }

    @Override
    public PageResponse<ProfessorSummaryResponse> searchProfessors(String query, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Professor> professors = professorRepository.searchProfessors(query, pageable);
        return mapToPageResponse(professors);
    }

    @Override
    @Transactional
    public ProfessorResponse updateProfessor(Long id, ProfessorRequest request) {
        Professor professor = professorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Professor not found"));

        if (!professor.getEmployeeId().equals(request.getEmployeeId()) && 
            professorRepository.existsByEmployeeId(request.getEmployeeId())) {
            throw new RuntimeException("Employee ID already exists");
        }

        Department department = departmentRepository.findById(request.getDepartmentId())
                .orElseThrow(() -> new RuntimeException("Department not found"));

        User user = professor.getUser();
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setPhone(request.getPhone());
        
        if (!user.getEmail().equals(request.getEmail()) && userRepository.existsByEmail(request.getEmail())) {
             throw new RuntimeException("Email already exists");
        }
        user.setEmail(request.getEmail());

        userRepository.save(user);

        professorMapper.updateEntityFromRequest(request, professor);
        professor.setDepartment(department);
        
        professor = professorRepository.save(professor);
        return professorMapper.toResponse(professor);
    }

    @Override
    @Transactional
    public void deleteProfessor(Long id) {
        Professor professor = professorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Professor not found"));
        professor.setStatus("INACTIVE");
        
        User user = professor.getUser();
        user.setIsActive(false);
        userRepository.save(user);
        
        professorRepository.save(professor);
    }

    @Override
    @Transactional
    public ProfessorResponse updateProfessorStatus(Long id, String status) {
        Professor professor = professorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Professor not found"));
        professor.setStatus(status);
        
        if ("INACTIVE".equals(status) || "RETIRED".equals(status)) {
            professor.getUser().setIsActive(false);
        } else {
            professor.getUser().setIsActive(true);
        }
        userRepository.save(professor.getUser());
        
        return professorMapper.toResponse(professorRepository.save(professor));
    }

    private PageResponse<ProfessorSummaryResponse> mapToPageResponse(Page<Professor> page) {
        List<ProfessorSummaryResponse> content = page.getContent().stream()
                .map(professorMapper::toSummaryResponse)
                .collect(Collectors.toList());
        
        return new PageResponse<>(
                content,
                page.getNumber(),
                page.getSize(),
                page.getTotalElements(),
                page.getTotalPages(),
                page.isLast()
        );
    }
}
