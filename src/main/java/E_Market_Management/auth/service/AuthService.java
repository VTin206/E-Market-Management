package E_Market_Management.auth.service;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.time.Instant;
import java.util.Base64;
import java.util.HexFormat;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import E_Market_Management.auth.dto.AuthResponse;
import E_Market_Management.auth.dto.AuthSession;
import E_Market_Management.auth.dto.ChangePasswordRequest;
import E_Market_Management.auth.dto.LoginRequest;
import E_Market_Management.auth.dto.RegisterRequest;
import E_Market_Management.auth.entity.RefreshToken;
import E_Market_Management.auth.repository.RefreshTokenRepository;
import E_Market_Management.auth.security.CustomUserDetails;
import E_Market_Management.auth.security.CustomUserDetailsService;
import E_Market_Management.auth.security.JwtService;
import E_Market_Management.membership.entity.MembershipTier;
import E_Market_Management.membership.repository.MembershipRepository;
import E_Market_Management.shared.exception.ConflictException;
import E_Market_Management.shared.exception.ResourceNotFoundException;
import E_Market_Management.user.entity.ROLE;
import E_Market_Management.user.entity.User;
import E_Market_Management.user.repository.UserRepository;

@Service
public class AuthService {
    private static final SecureRandom SECURE_RANDOM = new SecureRandom();

    private final UserRepository userRepository;
    private final MembershipRepository membershipRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final CustomUserDetailsService userDetailsService;
    private final RefreshTokenRepository refreshTokenRepository;

    @Value("${jwt.refresh-expiration}")
    private Long refreshExpiration;

    public AuthService(
        UserRepository userRepository,
        MembershipRepository membershipRepository,
        PasswordEncoder passwordEncoder,
        JwtService jwtService,
        AuthenticationManager authenticationManager,
        CustomUserDetailsService userDetailsService,
        RefreshTokenRepository refreshTokenRepository
    ) {
        this.userRepository = userRepository;
        this.membershipRepository = membershipRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.authenticationManager = authenticationManager;
        this.userDetailsService = userDetailsService;
        this.refreshTokenRepository = refreshTokenRepository;
    }

    @Transactional
    public AuthSession register(RegisterRequest request) {
        if (userRepository.existsByUserName(request.getUserName())) {
            throw new ConflictException("Username đã tồn tại!");
        }

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new ConflictException("Email đã tồn tại");
        }

        User user = User.builder()
            .userName(request.getUserName())
            .password(passwordEncoder.encode(request.getPassword()))
            .fullName(request.getFullName())
            .email(request.getEmail())
            .phone(request.getPhone())
            .role(ROLE.CUSTOMER)
            .points(0)
            .membership(membershipRepository.findByTier(MembershipTier.MEMBER)
                .orElseThrow(() -> new IllegalStateException("Thiếu hạng thành viên mặc định")))
            .build();

        User savedUser = userRepository.save(user);
        return issueSession(new CustomUserDetails(savedUser), UUID.randomUUID());
    }

    @Transactional
    public AuthSession login(LoginRequest request) {
        authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(
                request.getUserName(),
                request.getPassword()
            )
        );

        CustomUserDetails userDetails = (CustomUserDetails)
            userDetailsService.loadUserByUsername(request.getUserName());
        return issueSession(userDetails, UUID.randomUUID());
    }

    /**
     * Rotates a valid refresh token. Invalid/reused tokens return null so that
     * revocations made during reuse detection are committed by the transaction.
     */
    @Transactional
    public AuthSession refresh(String rawRefreshToken) {
        if (rawRefreshToken == null || rawRefreshToken.isBlank()) {
            return null;
        }

        RefreshToken currentToken = refreshTokenRepository
            .findByTokenHashForUpdate(hashToken(rawRefreshToken))
            .orElse(null);
        if (currentToken == null) {
            return null;
        }

        Instant now = Instant.now();
        if (currentToken.getRevokedAt() != null || !currentToken.getExpiresAt().isAfter(now)) {
            revokeFamily(currentToken.getFamilyId(), now);
            return null;
        }

        currentToken.setRevokedAt(now);
        refreshTokenRepository.save(currentToken);

        CustomUserDetails userDetails = new CustomUserDetails(currentToken.getUser());
        return issueSession(userDetails, currentToken.getFamilyId());
    }

    @Transactional
    public void logout(String rawRefreshToken) {
        if (rawRefreshToken == null || rawRefreshToken.isBlank()) {
            return;
        }

        refreshTokenRepository.findByTokenHashForUpdate(hashToken(rawRefreshToken))
            .ifPresent(token -> revokeFamily(token.getFamilyId(), Instant.now()));
    }

    @Transactional
    public void changePassword(ChangePasswordRequest request, Long userId) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy tài khoản hiện tại!"));

        boolean isMatch = passwordEncoder.matches(request.getCurrentPassword(), user.getPassword());
        if (!isMatch) {
            throw new ConflictException("Mật khẩu hiện tại không khớp!");
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);

        Instant now = Instant.now();
        refreshTokenRepository.findAllByUser_IdAndRevokedAtIsNull(userId)
            .forEach(token -> token.setRevokedAt(now));
    }

    private AuthSession issueSession(CustomUserDetails userDetails, UUID familyId) {
        Instant now = Instant.now();
        String rawRefreshToken = createRefreshToken();
        refreshTokenRepository.save(RefreshToken.builder()
            .user(userDetails.getUser())
            .tokenHash(hashToken(rawRefreshToken))
            .familyId(familyId)
            .createdAt(now)
            .expiresAt(now.plusMillis(refreshExpiration))
            .build());

        String role = userDetails.getAuthorities().stream()
            .map(GrantedAuthority::getAuthority)
            .filter(authority -> authority.startsWith("ROLE_"))
            .findFirst()
            .map(authority -> authority.substring("ROLE_".length()))
            .orElse("CUSTOMER");

        AuthResponse response = new AuthResponse(
            jwtService.generateToken(userDetails),
            "Bearer",
            role,
            jwtService.getExpirationSeconds()
        );
        return new AuthSession(response, rawRefreshToken, refreshExpiration / 1_000);
    }

    private void revokeFamily(UUID familyId, Instant revokedAt) {
        refreshTokenRepository.findAllByFamilyIdAndRevokedAtIsNull(familyId)
            .forEach(token -> token.setRevokedAt(revokedAt));
    }

    private String createRefreshToken() {
        byte[] randomBytes = new byte[32];
        SECURE_RANDOM.nextBytes(randomBytes);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(randomBytes);
    }

    private String hashToken(String token) {
        try {
            byte[] digest = MessageDigest.getInstance("SHA-256")
                .digest(token.getBytes(StandardCharsets.UTF_8));
            return HexFormat.of().formatHex(digest);
        } catch (NoSuchAlgorithmException ex) {
            throw new IllegalStateException("SHA-256 is not available", ex);
        }
    }
}
