package E_Market_Management.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import E_Market_Management.entity.CartItem;

public interface CartItemRepository extends JpaRepository<CartItem, Long>{
    
}
