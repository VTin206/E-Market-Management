package E_Market_Management.brand.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import E_Market_Management.brand.entity.Brand;

public interface BrandRepository extends JpaRepository<Brand, Long> {
    Optional<Brand> findByName(String name);
}
