package E_Market_Management.membership.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import E_Market_Management.membership.entity.Membership;

public interface MembershipRepository extends JpaRepository<Membership, Long> {
    
}
