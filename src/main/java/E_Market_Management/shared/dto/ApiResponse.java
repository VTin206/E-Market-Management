package E_Market_Management.shared.dto;

import java.time.Instant;

public record ApiResponse (
    Instant timestamp,
    int status,
    String error,
    String message,
    String path
) {}
