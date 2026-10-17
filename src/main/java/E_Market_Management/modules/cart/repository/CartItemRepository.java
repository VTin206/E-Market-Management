package E_Market_Management.modules.cart.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import E_Market_Management.modules.cart.domain.CartItem;

public interface CartItemRepository extends JpaRepository<CartItem, Long>{
    List<CartItem> findAllByCart_Id(Long cartId);

    Optional<CartItem> findByCart_IdAndProduct_Id(Long cartId, Long productId);

    Optional<CartItem> findByIdAndCart_User_Id(Long itemId, Long userId);

    void deleteAllByCart_Id(Long cartId);
}
