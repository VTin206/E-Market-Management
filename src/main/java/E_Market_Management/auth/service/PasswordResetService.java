package E_Market_Management.auth.service;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.time.Duration;
import java.time.Instant;
import java.util.Base64;
import java.util.HexFormat;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.util.UriComponentsBuilder;

import E_Market_Management.auth.dto.ResetPasswordRequest;
import E_Market_Management.auth.entity.PasswordResetToken;
import E_Market_Management.auth.entity.RefreshToken;
import E_Market_Management.auth.repository.PasswordResetTokenRepository;
import E_Market_Management.auth.repository.RefreshTokenRepository;
import E_Market_Management.user.entity.User;
import E_Market_Management.user.repository.UserRepository;

@Service
public class PasswordResetService {
    private static final Logger logger = LoggerFactory.getLogger(PasswordResetService.class);
    private static final SecureRandom SECURE_RANDOM = new SecureRandom();
    private static final Duration TOKEN_LIFETIME = Duration.ofMinutes(15);
    private static final Duration REQUEST_COOLDOWN = Duration.ofSeconds(60);
    private static final String GENERIC_RESET_ERROR = "Liên kết đặt lại mật khẩu không hợp lệ hoặc đã hết hạn";

    private final UserRepository userRepository;
    private final PasswordResetTokenRepository passwordResetTokenRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final JavaMailSender mailSender;

    @Value("${app.frontend.base-url:http://localhost:8080/frontend/index.html}")
    private String frontendBaseUrl;

    @Value("${app.mail.from:}")
    private String mailFrom;

    public PasswordResetService(
        UserRepository userRepository,
        PasswordResetTokenRepository passwordResetTokenRepository,
        RefreshTokenRepository refreshTokenRepository,
        PasswordEncoder passwordEncoder,
        JavaMailSender mailSender
    ) {
        this.userRepository = userRepository;
        this.passwordResetTokenRepository = passwordResetTokenRepository;
        this.refreshTokenRepository = refreshTokenRepository;
        this.passwordEncoder = passwordEncoder;
        this.mailSender = mailSender;
    }

    @Transactional
    public void requestReset(String email) {
        User user = userRepository.findByEmailIgnoreCase(email.trim()).orElse(null);
        if (user == null) {
            return;
        }

        Instant now = Instant.now();
        PasswordResetToken latestToken = passwordResetTokenRepository
            .findTopByUser_IdOrderByCreatedAtDesc(user.getId())
            .orElse(null);
        if (latestToken != null && latestToken.getCreatedAt().plus(REQUEST_COOLDOWN).isAfter(now)) {
            return;
        }

        passwordResetTokenRepository.findAllByUser_IdAndUsedAtIsNull(user.getId())
            .forEach(token -> token.setUsedAt(now));

        String rawToken = createToken();
        PasswordResetToken resetToken = passwordResetTokenRepository.save(PasswordResetToken.builder()
            .user(user)
            .tokenHash(hashToken(rawToken))
            .createdAt(now)
            .expiresAt(now.plus(TOKEN_LIFETIME))
            .build());

        try {
            sendResetEmail(user.getEmail(), rawToken);
        } catch (MailException exception) {
            resetToken.setUsedAt(now);
            logger.error("Could not send password reset email for user id {}", user.getId(), exception);
        }
    }

    @Transactional
    public void resetPassword(ResetPasswordRequest request) {
        if (!request.getNewPassword().equals(request.getConfirmPassword())) {
            throw new IllegalArgumentException("Mật khẩu xác nhận không khớp");
        }

        PasswordResetToken resetToken = passwordResetTokenRepository
            .findByTokenHashForUpdate(hashToken(request.getToken()))
            .orElseThrow(() -> new IllegalArgumentException(GENERIC_RESET_ERROR));

        Instant now = Instant.now();
        if (resetToken.getUsedAt() != null || !resetToken.getExpiresAt().isAfter(now)) {
            throw new IllegalArgumentException(GENERIC_RESET_ERROR);
        }

        User user = resetToken.getUser();
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);

        passwordResetTokenRepository.findAllByUser_IdAndUsedAtIsNull(user.getId())
            .forEach(token -> token.setUsedAt(now));
        List<RefreshToken> activeSessions = refreshTokenRepository
            .findAllByUser_IdAndRevokedAtIsNull(user.getId());
        activeSessions.forEach(token -> token.setRevokedAt(now));
    }

    private void sendResetEmail(String email, String rawToken) {
        String resetUrl = UriComponentsBuilder.fromUriString(frontendBaseUrl)
            .replaceQueryParam("resetToken", rawToken)
            .build()
            .encode()
            .toUriString();

        SimpleMailMessage message = new SimpleMailMessage();
        if (mailFrom != null && !mailFrom.isBlank()) {
            message.setFrom(mailFrom.trim());
        }
        message.setTo(email);
        message.setSubject("Đặt lại mật khẩu E-Market");
        message.setText("Bạn vừa yêu cầu đặt lại mật khẩu E-Market.\n\n"
            + "Mở liên kết sau trong vòng 15 phút để tạo mật khẩu mới:\n"
            + resetUrl + "\n\n"
            + "Nếu bạn không gửi yêu cầu này, hãy bỏ qua email. Mật khẩu hiện tại sẽ không thay đổi.");
        mailSender.send(message);
    }

    private String createToken() {
        byte[] randomBytes = new byte[32];
        SECURE_RANDOM.nextBytes(randomBytes);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(randomBytes);
    }

    private String hashToken(String token) {
        try {
            byte[] digest = MessageDigest.getInstance("SHA-256")
                .digest(token.getBytes(StandardCharsets.UTF_8));
            return HexFormat.of().formatHex(digest);
        } catch (NoSuchAlgorithmException exception) {
            throw new IllegalStateException("SHA-256 is not available", exception);
        }
    }
}
