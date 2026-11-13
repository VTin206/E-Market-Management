package E_Market_Management.auth.dto;

public record AuthSession(
    AuthResponse response,
    String refreshToken,
    long refreshTokenExpiresInSeconds
) {
}
