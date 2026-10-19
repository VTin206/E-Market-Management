package E_Market_Management.order.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import E_Market_Management.order.entity.OrderItem;

public interface OrderItemRepository extends JpaRepository<OrderItem, Long>{

    List<OrderItem> findAllByOrder_Id(Long id);
    
}
