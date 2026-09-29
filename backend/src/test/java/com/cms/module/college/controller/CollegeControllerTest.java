package com.cms.module.college.controller;

import com.cms.common.PageResponse;
import com.cms.module.college.dto.CollegeRequest;
import com.cms.module.college.dto.CollegeResponse;
import com.cms.module.college.service.CollegeService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.Collections;

import static org.mockito.ArgumentMatchers.any;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ExtendWith(MockitoExtension.class)
class CollegeControllerTest {

    private MockMvc mockMvc;

    private ObjectMapper objectMapper = new ObjectMapper();

    @Mock
    private CollegeService collegeService;

    @BeforeEach
    void setUp() {
        CollegeController controller = new CollegeController(collegeService);
        mockMvc = MockMvcBuilders.standaloneSetup(controller).build();
    }

    @Test
    void createCollege_Success() throws Exception {
        CollegeRequest request = new CollegeRequest();
        request.setCode("TEST01");
        request.setName("Test College");
        request.setCity("Test City");
        request.setState("Test State");
        request.setCountry("Test Country");

        CollegeResponse response = new CollegeResponse();
        response.setId(1L);
        response.setCode("TEST01");
        response.setName("Test College");

        Mockito.when(collegeService.createCollege(any(CollegeRequest.class))).thenReturn(response);

        mockMvc.perform(post("/api/v1/colleges")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(1L))
                .andExpect(jsonPath("$.code").value("TEST01"))
                .andExpect(jsonPath("$.name").value("Test College"));
    }

    @Test
    void getCollegeById_Success() throws Exception {
        CollegeResponse response = new CollegeResponse();
        response.setId(1L);
        response.setCode("TEST01");

        Mockito.when(collegeService.getCollegeById(1L)).thenReturn(response);

        mockMvc.perform(get("/api/v1/colleges/{id}", 1L))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1L))
                .andExpect(jsonPath("$.code").value("TEST01"));
    }

    @Test
    void getAllColleges_Success() throws Exception {
        PageResponse<?> pageResponse = new PageResponse<>(Collections.emptyList(), 0, 10, 0L, 0, true);

        Mockito.when(collegeService.getAllColleges(0, 10, "name", "asc")).thenReturn((PageResponse) pageResponse);

        mockMvc.perform(get("/api/v1/colleges")
                .param("page", "0")
                .param("size", "10")
                .param("sortBy", "name")
                .param("sortDir", "asc"))
                .andExpect(status().isOk());
    }
}
