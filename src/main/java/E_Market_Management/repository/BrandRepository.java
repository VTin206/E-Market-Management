package E_Market_Management.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import E_Market_Management.entity.Brand;

public interface BrandRepository extends JpaRepository<Brand, Long> {
    Optional<Brand> findByName(String name);
}
