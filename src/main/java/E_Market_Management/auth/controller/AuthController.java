package E_Market_Management.auth.controller;

import java.time.Duration;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.ResponseCookie;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import E_Market_Management.auth.dto.AuthResponse;
import E_Market_Management.auth.dto.AuthSession;
import E_Market_Management.auth.dto.ChangePasswordRequest;
import E_Market_Management.auth.dto.ForgotPasswordRequest;
import E_Market_Management.auth.dto.LoginRequest;
import E_Market_Management.auth.dto.RegisterRequest;
import E_Market_Management.auth.dto.ResetPasswordRequest;
import E_Market_Management.auth.security.CustomUserDetails;
import E_Market_Management.auth.service.AuthService;
import E_Market_Management.auth.service.PasswordResetService;
import io.swagger.v3.oas.annotations.Operation;
import java.util.Map;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private static final String REFRESH_COOKIE = "emarket_refresh";
    private static final String REFRESH_COOKIE_PATH = "/api/auth";

    private final AuthService authService;
    private final PasswordResetService passwordResetService;

    @Value("${auth.refresh-cookie.secure:false}")
    private boolean secureRefreshCookie;

    public AuthController(AuthService authService, PasswordResetService passwordResetService) {
        this.authService = authService;
        this.passwordResetService = passwordResetService;
    }

    @PostMapping("/register")
    @Operation(
        summary = "Đăng ký tài khoản khách hàng",
        description = "Tạo tài khoản khách hàng mới, trả JWT access token và đặt refresh token trong cookie HttpOnly."
    )
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        return sessionResponse(authService.register(request));
    }

    @PostMapping("/login")
    @Operation(
        summary = "Đăng nhập",
        description = "Xác thực tài khoản, trả JWT access token và đặt refresh token trong cookie HttpOnly."
    )
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        return sessionResponse(authService.login(request));
    }

    @PostMapping("/refresh")
    @Operation(
        summary = "Làm mới access token",
        description = "Đổi refresh token trong cookie HttpOnly lấy access token mới và refresh token mới. Refresh token cũ bị thu hồi."
    )
    public ResponseEntity<AuthResponse> refresh(
        @CookieValue(name = REFRESH_COOKIE, required = false) String refreshToken
    ) {
        AuthSession session = authService.refresh(refreshToken);
        if (session == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .build();
        }
        return sessionResponse(session);
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(
        @CookieValue(name = REFRESH_COOKIE, required = false) String refreshToken
    ) {
        authService.logout(refreshToken);
        return ResponseEntity.noContent()
            .header(HttpHeaders.SET_COOKIE, expiredRefreshCookie().toString())
            .build();
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

    @PostMapping("/forgot-password")
    @Operation(summary = "Yêu cầu đặt lại mật khẩu qua email")
    public ResponseEntity<Map<String, String>> forgotPassword(
        @Valid @RequestBody ForgotPasswordRequest request
    ) {
        passwordResetService.requestReset(request.getEmail());
        return ResponseEntity.accepted().body(Map.of(
            "message", "Nếu email tồn tại trong hệ thống, hướng dẫn đặt lại mật khẩu sẽ được gửi."
        ));
    }

    @PostMapping("/reset-password")
    @Operation(summary = "Đặt mật khẩu mới bằng liên kết email")
    public ResponseEntity<Void> resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        passwordResetService.resetPassword(request);
        return ResponseEntity.noContent().build();
    }

    private ResponseEntity<AuthResponse> sessionResponse(AuthSession session) {
        ResponseCookie refreshCookie = ResponseCookie.from(REFRESH_COOKIE, session.refreshToken())
            .httpOnly(true)
            .secure(secureRefreshCookie)
            .sameSite("Lax")
            .path(REFRESH_COOKIE_PATH)
            .maxAge(Duration.ofSeconds(session.refreshTokenExpiresInSeconds()))
            .build();

        return ResponseEntity.ok()
            .header(HttpHeaders.SET_COOKIE, refreshCookie.toString())
            .body(session.response());
    }

    private ResponseCookie expiredRefreshCookie() {
        return ResponseCookie.from(REFRESH_COOKIE, "")
            .httpOnly(true)
            .secure(secureRefreshCookie)
            .sameSite("Lax")
            .path(REFRESH_COOKIE_PATH)
            .maxAge(Duration.ZERO)
            .build();
    }
}
