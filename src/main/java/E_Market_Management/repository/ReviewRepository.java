package E_Market_Management.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import E_Market_Management.entity.Review;

public interface ReviewRepository extends JpaRepository<Review, Long> {
    Optional<Review> findByProductId(Long productId);
}