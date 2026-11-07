package E_Market_Management.review.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertSame;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import E_Market_Management.auth.security.CustomUserDetails;
import E_Market_Management.review.dto.ReviewResponse;
import E_Market_Management.review.dto.ReviewUpdateRequest;
import E_Market_Management.review.entity.Review;
import E_Market_Management.review.mapper.ReviewMapper;
import E_Market_Management.review.repository.ReviewRepository;
import E_Market_Management.user.entity.ROLE;
import E_Market_Management.user.entity.User;

@ExtendWith(MockitoExtension.class)
class ReviewServiceTest {

    @Mock
    private ReviewRepository reviewRepository;

    @Mock
    private ReviewMapper reviewMapper;

    @InjectMocks
    private ReviewService reviewService;

    @Test
    void updateReview_whenCallerOwnsReview_updatesAndReturnsReview() {
        User owner = user(7L, ROLE.CUSTOMER);
        Review review = Review.builder()
            .id(12L)
            .rating(2)
            .comment("Bình luận cũ")
            .user(owner)
            .build();
        ReviewUpdateRequest request = new ReviewUpdateRequest();
        request.setRating(5);
        request.setComment("Bình luận mới");
        ReviewResponse expected = ReviewResponse.builder()
            .id(12L)
            .rating(5)
            .comment("Bình luận mới")
            .build();

        when(reviewRepository.findById(12L)).thenReturn(Optional.of(review));
        when(reviewRepository.save(review)).thenReturn(review);
        when(reviewMapper.toResponse(review)).thenReturn(expected);

        ReviewResponse actual = reviewService.updateReview(
            12L,
            request,
            new CustomUserDetails(owner)
        );

        assertEquals(5, review.getRating());
        assertEquals("Bình luận mới", review.getComment());
        assertSame(expected, actual);
        verify(reviewRepository).save(review);
    }

    @Test
    void updateReview_whenCallerDoesNotOwnReview_throwsForbidden() {
        User owner = user(7L, ROLE.CUSTOMER);
        User caller = user(8L, ROLE.CUSTOMER);
        Review review = Review.builder()
            .id(12L)
            .rating(2)
            .user(owner)
            .build();

        when(reviewRepository.findById(12L)).thenReturn(Optional.of(review));

        ResponseStatusException exception = assertThrows(
            ResponseStatusException.class,
            () -> reviewService.updateReview(
                12L,
                new ReviewUpdateRequest(),
                new CustomUserDetails(caller)
            )
        );

        assertEquals(HttpStatus.FORBIDDEN, exception.getStatusCode());
        verify(reviewRepository, never()).save(review);
    }

    @Test
    void deleteReview_whenCallerOwnsReview_deletesReview() {
        User owner = user(7L, ROLE.CUSTOMER);
        Review review = Review.builder()
            .id(12L)
            .user(owner)
            .build();
        when(reviewRepository.findById(12L)).thenReturn(Optional.of(review));

        reviewService.deleteReview(12L, new CustomUserDetails(owner));

        verify(reviewRepository).delete(review);
    }

    private User user(Long id, ROLE role) {
        return User.builder()
            .id(id)
            .userName("user_" + id)
            .password("hash")
            .role(role)
            .build();
    }
}
