package E_Market_Management.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import E_Market_Management.entity.OrderItem;

public interface OrderItemRepository extends JpaRepository<OrderItem, Long>{
    
}
