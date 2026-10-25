package E_Market_Management.membership.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import E_Market_Management.membership.entity.Membership;

public interface MembershipRepository extends JpaRepository<Membership, Long> {
    Optional<Membership> findByName(String name);

    List<Membership> findAll();
}
