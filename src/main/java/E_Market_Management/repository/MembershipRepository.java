package E_Market_Management.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import E_Market_Management.entity.Membership;

public interface MembershipRepository extends JpaRepository<Membership, Long> {
    
}
