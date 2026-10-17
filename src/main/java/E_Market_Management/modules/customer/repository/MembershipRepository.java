package E_Market_Management.modules.customer.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import E_Market_Management.modules.customer.domain.Membership;

public interface MembershipRepository extends JpaRepository<Membership, Long> {
    
}
