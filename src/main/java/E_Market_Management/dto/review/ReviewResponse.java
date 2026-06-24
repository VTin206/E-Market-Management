package E_Market_Management.dto.review;

import java.time.LocalDateTime;

import lombok.*;


@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReviewResponse {
    private Long id;

    private Long userId;
    private String username;

    private Long productId;
    private String productName;

    private Integer rating;
    private String comment;
    private LocalDateTime createdAt;
}
