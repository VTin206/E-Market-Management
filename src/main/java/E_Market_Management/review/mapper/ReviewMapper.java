package E_Market_Management.review.mapper;

import org.springframework.stereotype.Component;

import E_Market_Management.review.dto.ReviewResponse;
import E_Market_Management.review.entity.Review;

@Component 
public class ReviewMapper {
    public ReviewResponse toResponse (Review review) {
        return new ReviewResponse().builder()
            .id(review.getId())
            .userId(review.getUser().getId())
            .username(review.getUser().getUserName())
            .productId(review.getProduct().getId())
            .productName(review.getProduct().getName())
            .rating(review.getRating())
            .comment(review.getComment())
            .createdAt(review.getCreatedAt())
            .build();
    }
}
