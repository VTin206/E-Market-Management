package E_Market_Management.order.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import E_Market_Management.order.entity.Payment;

public interface PaymentRepository extends JpaRepository<Payment, Long> {
}
