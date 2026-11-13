package E_Market_Management.auth.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import E_Market_Management.auth.dto.AuthResponse;
import E_Market_Management.auth.dto.ChangePasswordRequest;
import E_Market_Management.auth.dto.LoginRequest;
import E_Market_Management.auth.dto.RegisterRequest;
import E_Market_Management.auth.security.CustomUserDetails;
import E_Market_Management.auth.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    @Operation(
        summary = "Đăng ký tài khoản khách hàng",
        description = "Tạo tài khoản khách hàng mới. Khi đăng ký thành công, API trả về JWT access token và vai trò của tài khoản."
    )
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        return ResponseEntity.ok(authService.register(request));
    }

    @PostMapping("/login")
    @Operation(
        summary = "Đăng nhập",
        description = "Xác thực tên đăng nhập và mật khẩu, sau đó trả về JWT access token cùng vai trò của tài khoản."
    )
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @PatchMapping("/change-password")
    public ResponseEntity<Void> changePassword(
        @Valid @RequestBody ChangePasswordRequest request,
        @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        Long userId = userDetails.getId();
        authService.changePassword(request, userId);
        return ResponseEntity.noContent().build();
    }
}
