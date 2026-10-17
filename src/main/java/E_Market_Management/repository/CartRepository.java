package E_Market_Management.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import E_Market_Management.entity.Cart;

public interface CartRepository extends JpaRepository<Cart, Long>{
    Optional<Cart> findByUser_Id(Long userId);
}
