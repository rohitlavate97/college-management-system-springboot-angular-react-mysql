package com.cms.module.college.service.impl;

import com.cms.common.PageResponse;
import com.cms.exception.DuplicateResourceException;
import com.cms.exception.ResourceNotFoundException;
import com.cms.module.college.dto.CollegeRequest;
import com.cms.module.college.dto.CollegeResponse;
import com.cms.module.college.dto.CollegeSummaryResponse;
import com.cms.module.college.entity.College;
import com.cms.module.college.mapper.CollegeMapper;
import com.cms.module.college.repository.CollegeRepository;
import com.cms.module.college.service.CollegeService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.CacheEvict;

@Service
@RequiredArgsConstructor
@Slf4j
public class CollegeServiceImpl implements CollegeService {

    private final CollegeRepository collegeRepository;
    private final CollegeMapper collegeMapper;

    @Override
    @Transactional
    @CacheEvict(value = "colleges", allEntries = true)
    public CollegeResponse createCollege(CollegeRequest request) {
        log.info("Creating college with code: {}", request.getCode());
        if (collegeRepository.existsByCode(request.getCode())) {
            throw new DuplicateResourceException("College", "code", request.getCode());
        }
        if (collegeRepository.existsByName(request.getName())) {
            throw new DuplicateResourceException("College", "name", request.getName());
        }

        College college = collegeMapper.toEntity(request);
        if (college.getIsActive() == null) {
            college.setIsActive(true);
        }
        if (college.getCountry() == null) {
            college.setCountry("India");
        }

        College savedCollege = collegeRepository.save(college);
        return collegeMapper.toResponse(savedCollege);
    }

    @Override
    @Transactional(readOnly = true)
    @Cacheable(value = "colleges", key = "'id_' + #id")
    public CollegeResponse getCollegeById(Long id) {
        College college = collegeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("College", "id", id));
        return collegeMapper.toResponse(college);
    }

    @Override
    @Transactional(readOnly = true)
    @Cacheable(value = "colleges", key = "'code_' + #code")
    public CollegeResponse getCollegeByCode(String code) {
        College college = collegeRepository.findByCode(code)
                .orElseThrow(() -> new ResourceNotFoundException("College", "code", code));
        return collegeMapper.toResponse(college);
    }

    @Override
    @Transactional(readOnly = true)
    public PageResponse<CollegeSummaryResponse> getAllColleges(int page, int size, String sortBy, String sortDir) {
        Sort sort = sortDir.equalsIgnoreCase(Sort.Direction.ASC.name()) ? Sort.by(sortBy).ascending()
                : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);
        Page<College> colleges = collegeRepository.findAll(pageable);
        List<CollegeSummaryResponse> content = colleges.getContent().stream()
                .map(collegeMapper::toSummaryResponse)
                .collect(Collectors.toList());

        return new PageResponse<>(
                content,
                colleges.getNumber(),
                colleges.getSize(),
                colleges.getTotalElements(),
                colleges.getTotalPages(),
                colleges.isLast()
        );
    }

    @Override
    @Transactional(readOnly = true)
    public PageResponse<CollegeSummaryResponse> searchColleges(String query, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("name").ascending());
        Page<College> colleges = collegeRepository.findByNameContainingIgnoreCaseOrCodeContainingIgnoreCase(query, query, pageable);
        List<CollegeSummaryResponse> content = colleges.getContent().stream()
                .map(collegeMapper::toSummaryResponse)
                .collect(Collectors.toList());

        return new PageResponse<>(
                content,
                colleges.getNumber(),
                colleges.getSize(),
                colleges.getTotalElements(),
                colleges.getTotalPages(),
                colleges.isLast()
        );
    }

    @Override
    @Transactional
    @CacheEvict(value = "colleges", allEntries = true)
    public CollegeResponse updateCollege(Long id, CollegeRequest request) {
        log.info("Updating college with id: {}", id);
        College college = collegeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("College", "id", id));

        if (!college.getCode().equals(request.getCode()) && collegeRepository.existsByCode(request.getCode())) {
            throw new DuplicateResourceException("College", "code", request.getCode());
        }
        if (!college.getName().equals(request.getName()) && collegeRepository.existsByName(request.getName())) {
            throw new DuplicateResourceException("College", "name", request.getName());
        }

        collegeMapper.updateEntityFromRequest(request, college);
        College updatedCollege = collegeRepository.save(college);
        return collegeMapper.toResponse(updatedCollege);
    }

    @Override
    @Transactional
    @CacheEvict(value = "colleges", allEntries = true)
    public void deleteCollege(Long id) {
        log.info("Deleting college with id: {}", id);
        College college = collegeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("College", "id", id));
        collegeRepository.delete(college);
    }

    @Override
    @Transactional
    @CacheEvict(value = "colleges", allEntries = true)
    public void toggleCollegeStatus(Long id) {
        log.info("Toggling active status for college with id: {}", id);
        College college = collegeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("College", "id", id));
        college.setIsActive(!college.getIsActive());
        collegeRepository.save(college);
    }
}
