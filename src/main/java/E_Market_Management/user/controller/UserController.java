package E_Market_Management.user.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import E_Market_Management.auth.security.CustomUserDetails;
import E_Market_Management.user.dto.UserResponse;
import E_Market_Management.user.dto.UserUpdateRequest;
import E_Market_Management.user.dto.UserUpdateRoleRequest;
import E_Market_Management.user.service.UserService;
import jakarta.validation.Valid;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;


@RestController
@RequestMapping("/api/user")
public class UserController {
    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/profile")
    public ResponseEntity<UserResponse> getUserProfile(
        @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        Long userId = userDetails.getId();
        return ResponseEntity.ok(
            userService.getUserProfile(userId)
        );
    }

    @PatchMapping("/profile")
    public ResponseEntity<UserResponse> updateUserProfile(
        @AuthenticationPrincipal CustomUserDetails userDetails,
        @Valid @RequestBody UserUpdateRequest request
    ) {
        Long userId = userDetails.getId();
        return ResponseEntity.ok(
            userService.updateUserProfile(userId, request)
        );
    }

    @PatchMapping("/profile/{id}")
    public ResponseEntity<UserResponse> updateUserRole(
        @PathVariable("id") Long userId,
        @Valid @RequestBody UserUpdateRoleRequest request
    ) {
        return ResponseEntity.ok(
            userService.updateRole(userId, request)
        );
    }

}
