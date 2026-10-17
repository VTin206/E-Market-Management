package E_Market_Management.modules.customer.repository;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import E_Market_Management.modules.customer.domain.User;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUserName(String userName);

    Optional<User> findByEmail(String email);

    boolean existsByUserName(String userName);

    boolean existsByEmail(String email);
}
