package E_Market_Management.repository;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import E_Market_Management.entity.User;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> finByUsername(String userName);

    Optional<User> finByEmail(String email);

    boolean existsByUsername(String userName);

    boolean existsByEmail(String email);
}
