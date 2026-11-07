package E_Market_Management.review.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import E_Market_Management.auth.security.CustomUserDetails;
import E_Market_Management.review.dto.ReviewCreateRequest;
import E_Market_Management.review.dto.ReviewResponse;
import E_Market_Management.review.dto.ReviewUpdateRequest;
import E_Market_Management.review.service.ReviewService;
import jakarta.validation.Valid;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;



@RestController 
@RequestMapping("/api/reviews")
public class ReviewController {
    
    private final ReviewService reviewService;

    public ReviewController(ReviewService reviewService) {
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
    
    @GetMapping("/{id}")
    public ResponseEntity<ReviewResponse> getReviewById(@PathVariable Long id) {
        return ResponseEntity.ok(
            reviewService.getReviewById(id)
        );
    }

    @PostMapping("/product/{productId}")
    public ResponseEntity<ReviewResponse> postReview(
            @Valid @RequestBody ReviewCreateRequest request,
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable("productId") Long productId
        ) {
        return ResponseEntity.status(HttpStatus.CREATED).body(
            reviewService.postReview(request, userDetails, productId)
        );
    }

    @PutMapping("/{reviewId}")
    public ResponseEntity<ReviewResponse> updateReview(
            @PathVariable Long reviewId,
            @Valid @RequestBody ReviewUpdateRequest request,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        return ResponseEntity.ok(
            reviewService.updateReview(reviewId, request, userDetails)
        );
    }

    @DeleteMapping("/{reviewId}")
    public ResponseEntity<Void> deleteReview(
            @PathVariable Long reviewId,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        reviewService.deleteReview(reviewId, userDetails);
        return ResponseEntity.noContent().build();
    }
}
