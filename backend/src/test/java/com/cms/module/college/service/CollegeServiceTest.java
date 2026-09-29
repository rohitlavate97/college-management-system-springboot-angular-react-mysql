package com.cms.module.college.service;

import com.cms.exception.DuplicateResourceException;
import com.cms.exception.ResourceNotFoundException;
import com.cms.module.college.dto.CollegeRequest;
import com.cms.module.college.dto.CollegeResponse;
import com.cms.module.college.entity.College;
import com.cms.module.college.mapper.CollegeMapper;
import com.cms.module.college.repository.CollegeRepository;
import com.cms.module.college.service.impl.CollegeServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CollegeServiceTest {

    @Mock
    private CollegeRepository collegeRepository;

    @Mock
    private CollegeMapper collegeMapper;

    @InjectMocks
    private CollegeServiceImpl collegeService;

    private CollegeRequest collegeRequest;
    private College college;
    private CollegeResponse collegeResponse;

    @BeforeEach
    void setUp() {
        collegeRequest = new CollegeRequest();
        collegeRequest.setCode("TEST01");
        collegeRequest.setName("Test College");

        college = new College();
        college.setId(1L);
        college.setCode("TEST01");
        college.setName("Test College");
        college.setIsActive(true);

        collegeResponse = new CollegeResponse();
        collegeResponse.setId(1L);
        collegeResponse.setCode("TEST01");
        collegeResponse.setName("Test College");
        collegeResponse.setIsActive(true);
    }

    @Test
    void createCollege_Success() {
        when(collegeRepository.existsByCode(collegeRequest.getCode())).thenReturn(false);
        when(collegeRepository.existsByName(collegeRequest.getName())).thenReturn(false);
        when(collegeMapper.toEntity(collegeRequest)).thenReturn(college);
        when(collegeRepository.save(any(College.class))).thenReturn(college);
        when(collegeMapper.toResponse(college)).thenReturn(collegeResponse);

        CollegeResponse result = collegeService.createCollege(collegeRequest);

        assertNotNull(result);
        assertEquals(collegeRequest.getCode(), result.getCode());
        verify(collegeRepository).save(any(College.class));
    }

    @Test
    void createCollege_DuplicateCode_ThrowsException() {
        when(collegeRepository.existsByCode(collegeRequest.getCode())).thenReturn(true);

        assertThrows(DuplicateResourceException.class, () -> collegeService.createCollege(collegeRequest));
        verify(collegeRepository, never()).save(any(College.class));
    }

    @Test
    void getCollegeById_Success() {
        when(collegeRepository.findById(1L)).thenReturn(Optional.of(college));
        when(collegeMapper.toResponse(college)).thenReturn(collegeResponse);

        CollegeResponse result = collegeService.getCollegeById(1L);

        assertNotNull(result);
        assertEquals(1L, result.getId());
    }

    @Test
    void getCollegeById_NotFound_ThrowsException() {
        when(collegeRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> collegeService.getCollegeById(1L));
    }

    @Test
    void updateCollege_Success() {
        CollegeRequest updateRequest = new CollegeRequest();
        updateRequest.setCode("UPD01");
        updateRequest.setName("Updated College");

        when(collegeRepository.findById(1L)).thenReturn(Optional.of(college));
        when(collegeRepository.existsByCode("UPD01")).thenReturn(false);
        when(collegeRepository.existsByName("Updated College")).thenReturn(false);
        when(collegeRepository.save(any(College.class))).thenReturn(college);
        
        CollegeResponse updatedResponse = new CollegeResponse();
        updatedResponse.setId(1L);
        updatedResponse.setCode("UPD01");
        updatedResponse.setName("Updated College");
        when(collegeMapper.toResponse(college)).thenReturn(updatedResponse);

        CollegeResponse result = collegeService.updateCollege(1L, updateRequest);

        assertNotNull(result);
        assertEquals("UPD01", result.getCode());
        verify(collegeMapper).updateEntityFromRequest(updateRequest, college);
        verify(collegeRepository).save(college);
    }

    @Test
    void toggleCollegeStatus_Success() {
        when(collegeRepository.findById(1L)).thenReturn(Optional.of(college));
        when(collegeRepository.save(any(College.class))).thenReturn(college);

        collegeService.toggleCollegeStatus(1L);

        assertFalse(college.getIsActive()); // Toggle true -> false
        verify(collegeRepository).save(college);
    }
}
