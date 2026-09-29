package com.cms.module.auth.service;

import com.cms.module.auth.dto.AuthResponse;
import com.cms.module.auth.dto.LoginRequest;
import com.cms.module.auth.dto.RefreshTokenRequest;
import com.cms.module.auth.dto.UserProfileResponse;

public interface AuthService {
    AuthResponse login(LoginRequest request);
    AuthResponse refreshToken(RefreshTokenRequest request);
    void logout(String refreshToken);
    UserProfileResponse getCurrentUser();
}
