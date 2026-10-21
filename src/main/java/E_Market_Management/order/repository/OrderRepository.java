package E_Market_Management.order.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import E_Market_Management.order.entity.Order;

public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findAllByUser_Id(Long userId);

    Optional<Order> findByIdAndUserId(Long orderId, Long userId);
}
