package E_Market_Management.cart.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import E_Market_Management.cart.entity.Cart;

public interface CartRepository extends JpaRepository<Cart, Long>{
    Optional<Cart> findByUser_Id(Long userId);
}
