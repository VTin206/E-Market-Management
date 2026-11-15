package E_Market_Management.review.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.web.server.ResponseStatusException;

import E_Market_Management.auth.security.CustomUserDetails;
import E_Market_Management.product.entity.Product;
import E_Market_Management.product.repository.ProductRepository;
import E_Market_Management.order.entity.STATUS;
import E_Market_Management.order.repository.OrderRepository;
import E_Market_Management.review.dto.ReviewCreateRequest;
import E_Market_Management.review.dto.ReviewResponse;
import E_Market_Management.review.dto.ReviewUpdateRequest;
import E_Market_Management.review.entity.Review;
import E_Market_Management.review.mapper.ReviewMapper;
import E_Market_Management.review.repository.ReviewRepository;
import E_Market_Management.shared.exception.ResourceNotFoundException;
import E_Market_Management.user.entity.User;

@Service 
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final ProductRepository productRepository;
    private final ReviewMapper reviewMapper;
    private final OrderRepository orderRepository;

    public ReviewService(
        ReviewRepository reviewRepository,
        ProductRepository productRepository,
        ReviewMapper reviewMapper,
        OrderRepository orderRepository
    ) {
        this.reviewRepository = reviewRepository;
        this.productRepository = productRepository;
        this.reviewMapper = reviewMapper;
        this.orderRepository = orderRepository;
    }

    @Transactional(readOnly = true)
    public List<ReviewResponse> getReviewsByProduct(Long productId) {
        if(productRepository.findById(productId).isEmpty()) {
            throw new ResourceNotFoundException("Không tìm thấy sản phẩm");
        }

        List<Review> reviews = reviewRepository.findAllByProduct_Id(productId);
        List<ReviewResponse> responses = reviews.stream()
            .map(this::toResponse)
            .toList();
        return responses;
    }

    @Transactional(readOnly = true)
    public ReviewResponse getReviewById(Long reviewId) {
        Review review = reviewRepository.findById(reviewId)
            .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy đánh giá"));

        return toResponse(review);
    }

    @Transactional
    public ReviewResponse postReview(ReviewCreateRequest request, CustomUserDetails userDetails, Long productId) {
        Product product = productRepository.findById(productId)
            .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy sản phẩm"));
        User user = userDetails.getUser();
        if(user == null) {
            throw new ResourceNotFoundException("Không tìm thấy tài khoản. Vui lòng đăng nhập trước khi đánh giá");
        }

        boolean purchased = orderRepository.existsByUserAndProductAndStatus(
            user.getId(),
            productId,
            STATUS.COMPLETED
        );
        if (!purchased) {
            throw new ResponseStatusException(
                HttpStatus.FORBIDDEN,
                "Bạn chỉ có thể đánh giá sản phẩm đã mua và hoàn tất đơn hàng"
            );
        }

        Review review = Review.builder()
            .rating(request.getRating())
            .comment(request.getComment())
            .createdAt(LocalDateTime.now())
            .user(user)
            .product(product)
            .build();
        return toResponse(reviewRepository.save(review));
    }

    @Transactional
    public ReviewResponse updateReview(
            Long reviewId,
            ReviewUpdateRequest request,
            CustomUserDetails userDetails
    ) {
        Review review = findReviewForUser(reviewId, userDetails);
        review.setRating(request.getRating());
        review.setComment(request.getComment());

        return toResponse(reviewRepository.save(review));
    }

    private ReviewResponse toResponse(Review review) {
        ReviewResponse response = reviewMapper.toResponse(review);
        response.setVerifiedPurchase(review.getUser() != null
            && review.getProduct() != null
            && orderRepository.existsByUserAndProductAndStatus(
                review.getUser().getId(),
                review.getProduct().getId(),
                STATUS.COMPLETED
            ));
        return response;
    }

    @Transactional
    public void deleteReview(Long reviewId, CustomUserDetails userDetails) {
        Review review = findReviewForUser(reviewId, userDetails);
        reviewRepository.delete(review);
    }

    private Review findReviewForUser(Long reviewId, CustomUserDetails userDetails) {
        Review review = reviewRepository.findById(reviewId)
            .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy đánh giá"));

        boolean isAdmin = userDetails.getAuthorities().stream()
            .map(GrantedAuthority::getAuthority)
            .anyMatch("ROLE_ADMIN"::equals);
        boolean isOwner = review.getUser() != null
            && userDetails.getId().equals(review.getUser().getId());

        if (!isAdmin && !isOwner) {
            throw new ResponseStatusException(
                HttpStatus.FORBIDDEN,
                "Bạn không có quyền sửa hoặc xóa đánh giá này"
            );
        }

        return review;
    }
}
