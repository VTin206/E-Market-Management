package E_Market_Management.auth.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.util.ReflectionTestUtils;

import E_Market_Management.auth.dto.AuthSession;
import E_Market_Management.auth.dto.ChangePasswordRequest;
import E_Market_Management.auth.dto.LoginRequest;
import E_Market_Management.auth.dto.RegisterRequest;
import E_Market_Management.auth.entity.RefreshToken;
import E_Market_Management.auth.repository.RefreshTokenRepository;
import E_Market_Management.auth.security.CustomUserDetails;
import E_Market_Management.auth.security.CustomUserDetailsService;
import E_Market_Management.auth.security.JwtService;
import E_Market_Management.membership.entity.Membership;
import E_Market_Management.membership.entity.MembershipTier;
import E_Market_Management.membership.repository.MembershipRepository;
import E_Market_Management.shared.exception.ConflictException;
import E_Market_Management.user.entity.ROLE;
import E_Market_Management.user.entity.User;
import E_Market_Management.user.repository.UserRepository;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private MembershipRepository membershipRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtService jwtService;

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private CustomUserDetailsService userDetailsService;

    @Mock
    private RefreshTokenRepository refreshTokenRepository;

    @InjectMocks
    private AuthService authService;

    @BeforeEach
    void setUp() {
        ReflectionTestUtils.setField(authService, "refreshExpiration", 604800000L);
    }

    @Test
    void register_whenUsernameAndEmailAreAvailable_createsCustomerSession() {
        stubSessionDependencies();
        RegisterRequest request = new RegisterRequest();
        request.setUserName("new-user");
        request.setPassword("plain-password");
        request.setFullName("New User");
        request.setEmail("new@example.com");
        request.setPhone("0900000000");

        Membership membership = membership();
        User savedUser = user(42L, "new-user", ROLE.CUSTOMER);
        when(userRepository.existsByUserName("new-user")).thenReturn(false);
        when(userRepository.existsByEmail("new@example.com")).thenReturn(false);
        when(passwordEncoder.encode("plain-password")).thenReturn("hashed-password");
        when(membershipRepository.findByTier(MembershipTier.MEMBER))
            .thenReturn(Optional.of(membership));
        when(userRepository.save(any(User.class))).thenReturn(savedUser);

        AuthSession session = authService.register(request);

        assertNotNull(session);
        assertNotNull(session.refreshToken());
        assertFalse(session.refreshToken().isBlank());
        assertEquals("access-token", session.response().getAccessToken());
        assertEquals("CUSTOMER", session.response().getRole());
        assertEquals(604800L, session.refreshTokenExpiresInSeconds());

        ArgumentCaptor<User> userCaptor = ArgumentCaptor.forClass(User.class);
        verify(userRepository).save(userCaptor.capture());
        assertEquals("new-user", userCaptor.getValue().getUserName());
        assertEquals("hashed-password", userCaptor.getValue().getPassword());
        assertEquals(ROLE.CUSTOMER, userCaptor.getValue().getRole());
        assertEquals(0, userCaptor.getValue().getPoints());
        assertEquals(membership, userCaptor.getValue().getMembership());
        verify(refreshTokenRepository).save(any(RefreshToken.class));
    }

    @Test
    void register_whenUsernameAlreadyExists_throwsConflictWithoutSaving() {
        RegisterRequest request = new RegisterRequest();
        request.setUserName("existing-user");
        request.setEmail("new@example.com");

        when(userRepository.existsByUserName("existing-user")).thenReturn(true);

        assertThrows(ConflictException.class, () -> authService.register(request));

        verify(userRepository, never()).existsByEmail(any(String.class));
        verify(userRepository, never()).save(any(User.class));
        verify(refreshTokenRepository, never()).save(any(RefreshToken.class));
    }

    @Test
    void refresh_whenTokenIsValid_rotatesTokenAndRevokesCurrentToken() {
        User user = user(7L, "customer", ROLE.CUSTOMER);
        UUID familyId = UUID.randomUUID();
        RefreshToken current = RefreshToken.builder()
            .id(5L)
            .user(user)
            .familyId(familyId)
            .createdAt(Instant.now().minusSeconds(60))
            .expiresAt(Instant.now().plusSeconds(3600))
            .build();
        when(refreshTokenRepository.findByTokenHashForUpdate(any(String.class)))
            .thenReturn(Optional.of(current));
        stubSessionDependencies();

        AuthSession session = authService.refresh("valid-refresh-token");

        assertNotNull(session);
        assertFalse(session.refreshToken().isBlank());
        assertEquals("access-token", session.response().getAccessToken());
        assertNotNull(current.getRevokedAt());
        verify(refreshTokenRepository).save(current);
        verify(refreshTokenRepository, times(2)).save(any(RefreshToken.class));
    }

    @Test
    void refresh_whenTokenIsExpired_revokesFamilyAndReturnsNull() {
        UUID familyId = UUID.randomUUID();
        RefreshToken expired = RefreshToken.builder()
            .familyId(familyId)
            .expiresAt(Instant.now().minusSeconds(1))
            .build();
        when(refreshTokenRepository.findByTokenHashForUpdate(any(String.class)))
            .thenReturn(Optional.of(expired));
        RefreshToken sibling = RefreshToken.builder().familyId(familyId).build();
        when(refreshTokenRepository.findAllByFamilyIdAndRevokedAtIsNull(eq(familyId)))
            .thenReturn(List.of(expired, sibling));

        AuthSession session = authService.refresh("expired-refresh-token");

        assertNull(session);
        assertNotNull(expired.getRevokedAt());
        assertNotNull(sibling.getRevokedAt());
        verify(refreshTokenRepository, never()).save(any(RefreshToken.class));
    }

    @Test
    void logout_whenTokenBelongsToFamily_revokesAllActiveTokensInFamily() {
        UUID familyId = UUID.randomUUID();
        RefreshToken current = RefreshToken.builder().familyId(familyId).build();
        RefreshToken sibling = RefreshToken.builder().familyId(familyId).build();
        when(refreshTokenRepository.findByTokenHashForUpdate(any(String.class)))
            .thenReturn(Optional.of(current));
        when(refreshTokenRepository.findAllByFamilyIdAndRevokedAtIsNull(familyId))
            .thenReturn(List.of(current, sibling));

        authService.logout("refresh-token");

        assertNotNull(current.getRevokedAt());
        assertNotNull(sibling.getRevokedAt());
    }

    @Test
    void changePassword_whenCurrentPasswordMatches_updatesPasswordAndRevokesSessions() {
        User user = user(7L, "customer", ROLE.CUSTOMER);
        user.setPassword("old-hash");
        ChangePasswordRequest request = new ChangePasswordRequest();
        request.setCurrentPassword("old-password");
        request.setNewPassword("new-password");
        RefreshToken activeToken = RefreshToken.builder().build();
        when(userRepository.findById(7L)).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("old-password", "old-hash")).thenReturn(true);
        when(passwordEncoder.encode("new-password")).thenReturn("new-hash");
        when(refreshTokenRepository.findAllByUser_IdAndRevokedAtIsNull(7L))
            .thenReturn(List.of(activeToken));

        authService.changePassword(request, 7L);

        assertEquals("new-hash", user.getPassword());
        assertNotNull(activeToken.getRevokedAt());
        verify(userRepository).save(user);
    }

    @Test
    void changePassword_whenCurrentPasswordDoesNotMatch_throwsConflict() {
        User user = user(7L, "customer", ROLE.CUSTOMER);
        user.setPassword("old-hash");
        ChangePasswordRequest request = new ChangePasswordRequest();
        request.setCurrentPassword("wrong-password");
        request.setNewPassword("new-password");
        when(userRepository.findById(7L)).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("wrong-password", "old-hash")).thenReturn(false);

        assertThrows(ConflictException.class, () -> authService.changePassword(request, 7L));

        verify(userRepository, never()).save(any(User.class));
        verify(refreshTokenRepository, never()).findAllByUser_IdAndRevokedAtIsNull(7L);
    }

    private User user(Long id, String username, ROLE role) {
        return User.builder()
            .id(id)
            .userName(username)
            .password("password-hash")
            .fullName("Test User")
            .email(username + "@example.com")
            .role(role)
            .points(0)
            .membership(membership())
            .build();
    }

    private Membership membership() {
        return org.mockito.Mockito.mock(Membership.class);
    }

    private void stubSessionDependencies() {
        when(jwtService.generateToken(any(CustomUserDetails.class))).thenReturn("access-token");
        when(jwtService.getExpirationSeconds()).thenReturn(900L);
    }
}
