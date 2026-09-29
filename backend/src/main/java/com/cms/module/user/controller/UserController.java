package com.cms.module.user.controller;

import com.cms.module.user.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
@Tag(name = "User Management")
public class UserController {

    private final UserService userService;

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('SUPER_ADMIN') or (hasRole('STUDENT') and @securityService.isOwner(#id))")
    @Operation(summary = "Anonymize and delete personal data (GDPR Right-to-be-Forgotten)")
    public ResponseEntity<Void> deleteUserData(@PathVariable Long id) {
        userService.anonymizeAndDeleteUserData(id);
        return ResponseEntity.noContent().build();
    }
}
