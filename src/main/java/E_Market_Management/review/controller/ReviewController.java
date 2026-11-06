package E_Market_Management.review.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import E_Market_Management.review.dto.ReviewResponse;
import E_Market_Management.review.service.ReviewService;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;


@RestController 
@RequestMapping("/api/reviews")
public class ReviewController {
    
    private final ReviewService reviewService;

    ReviewController(ReviewService reviewService) {
        this.reviewService = reviewService;
    }

    @GetMapping
    public ResponseEntity<List<ReviewResponse>> getReviewsByProduct(
        @RequestParam Long productId
    ) {
        return ResponseEntity.ok(
            reviewService.getReviewsByProduct(productId)
        );
    }
    
    @GetMapping("{id}")
    public ResponseEntity<ReviewResponse> getReviewById(@PathVariable Long reviewId) {
        return ResponseEntity.ok(
            reviewService.getReviewById(reviewId)
        );
    }
}
