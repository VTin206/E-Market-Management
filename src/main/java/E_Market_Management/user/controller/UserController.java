package E_Market_Management.user.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import E_Market_Management.auth.security.CustomUserDetails;
import E_Market_Management.user.dto.UserResponse;
import E_Market_Management.user.dto.UserUpdateRequest;
import E_Market_Management.user.dto.UserUpdateRoleRequest;
import E_Market_Management.user.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;

import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;


@RestController
@RequestMapping("/api/users")
public class UserController {
    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    @Operation(
        summary = "Lấy danh sách người dùng",
        description = "Trả về danh sách người dùng theo trang. page bắt đầu từ 0, size mặc định là 20 và phải nằm trong khoảng từ 1 đến 100. Yêu cầu xác thực."
    )
    public ResponseEntity<Page<UserResponse>> getUsers(
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "20") int size
    ) {
        return ResponseEntity.ok(userService.getUsers(page, size));
    }

    @GetMapping("/profile")
    @Operation(
        summary = "Lấy hồ sơ người dùng hiện tại",
        description = "Trả về hồ sơ của tài khoản đang đăng nhập. Yêu cầu xác thực."
    )
    public ResponseEntity<UserResponse> getUserProfile(
        @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        Long userId = userDetails.getId();
        return ResponseEntity.ok(
            userService.getUserProfile(userId)
        );
    }

    @PatchMapping("/profile")
    @Operation(
        summary = "Cập nhật hồ sơ người dùng hiện tại",
        description = "Cập nhật các thông tin được gửi lên trong hồ sơ của tài khoản đang đăng nhập, gồm tên đăng nhập, họ tên, email và số điện thoại. Yêu cầu xác thực."
    )
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
    @Operation(
        summary = "Cập nhật vai trò người dùng",
        description = "Thay đổi vai trò của người dùng theo ID. Chỉ quản trị viên được phép thực hiện."
    )
    public ResponseEntity<UserResponse> updateUserRole(
        @PathVariable("id") Long userId,
        @Valid @RequestBody UserUpdateRoleRequest request
    ) {
        return ResponseEntity.ok(
            userService.updateRole(userId, request)
        );
    }

}
