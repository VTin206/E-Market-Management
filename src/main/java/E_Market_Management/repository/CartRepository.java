package E_Market_Management.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import E_Market_Management.entity.Cart;

public interface CartRepository extends JpaRepository<Cart, Long>{

    
}
