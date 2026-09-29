package com.cms.module.user.service.impl;

import com.cms.exception.ResourceNotFoundException;
import com.cms.module.user.entity.User;
import com.cms.module.user.repository.UserRepository;
import com.cms.module.user.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    @Override
    @Transactional
    public void anonymizeAndDeleteUserData(Long userId) {
        log.info("Anonymizing personal data for user id: {}", userId);
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        user.setIsActive(false);
        user.setIsEmailVerified(false);
        user.setFirstName("REDACTED");
        user.setLastName("REDACTED");
        user.setEmail("anonymized_" + userId + "@cms.local");
        user.setPhone(null);
        user.setPasswordHash("$2a$10$ANONYMIZED_USER_ACCOUNT_CANNOT_LOGIN");
        userRepository.save(user);
        log.info("Personal data successfully anonymized for user id: {}", userId);
    }
}
