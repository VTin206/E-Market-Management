package E_Market_Management.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import E_Market_Management.entity.Order;

public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findAllByUser_Id(Long userId);
}
