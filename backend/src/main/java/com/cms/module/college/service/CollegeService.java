package com.cms.module.college.service;

import com.cms.common.PageResponse;
import com.cms.module.college.dto.CollegeRequest;
import com.cms.module.college.dto.CollegeResponse;
import com.cms.module.college.dto.CollegeSummaryResponse;

public interface CollegeService {
    CollegeResponse createCollege(CollegeRequest request);
    CollegeResponse getCollegeById(Long id);
    CollegeResponse getCollegeByCode(String code);
    PageResponse<CollegeSummaryResponse> getAllColleges(int page, int size, String sortBy, String sortDir);
    PageResponse<CollegeSummaryResponse> searchColleges(String query, int page, int size);
    CollegeResponse updateCollege(Long id, CollegeRequest request);
    void deleteCollege(Long id);
    void toggleCollegeStatus(Long id);
}
