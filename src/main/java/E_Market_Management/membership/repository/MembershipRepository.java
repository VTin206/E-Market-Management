package E_Market_Management.membership.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import E_Market_Management.membership.entity.Membership;
import E_Market_Management.membership.entity.MembershipTier;

public interface MembershipRepository extends JpaRepository<Membership, Long> {
    Optional<Membership> findByTier(MembershipTier tier);
}
