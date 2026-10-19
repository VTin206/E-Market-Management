package E_Market_Management.review.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import E_Market_Management.review.entity.Review;

public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findAllByProduct_Id(Long productId);
}
