package E_Market_Management.review.service;

import java.util.List;

import org.springframework.stereotype.Service;

import E_Market_Management.product.entity.Product;
import E_Market_Management.product.repository.ProductRepository;
import E_Market_Management.review.dto.ReviewResponse;
import E_Market_Management.review.entity.Review;
import E_Market_Management.review.mapper.ReviewMapper;
import E_Market_Management.review.repository.ReviewRepository;
import E_Market_Management.shared.exception.ResourceNotFoundException;

@Service 
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final ProductRepository productRepository;
    private final ReviewMapper reviewMapper;

    public ReviewService(
        ReviewRepository reviewRepository,
        ProductRepository productRepository,
        ReviewMapper reviewMapper
    ) {
        this.reviewRepository = reviewRepository;
        this.productRepository = productRepository;
        this.reviewMapper = reviewMapper;
    }

    public List<ReviewResponse> getReviewsByProduct(Long productId) {
        if(productRepository.findById(productId).isEmpty()) {
            throw new ResourceNotFoundException("Không tìm thấy sản phẩm");
        }

        List<Review> reviews = reviewRepository.findAllByProduct_Id(productId);
        List<ReviewResponse> responses = reviews.stream()
            .map(review -> reviewMapper.toResponse(review))
            .toList();
        return responses;
    }

    public ReviewResponse getReviewById(Long reviewId) {
        Review review = reviewRepository.findById(reviewId)
            .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy đánh giá"));

        return reviewMapper.toResponse(review);
    }
}
