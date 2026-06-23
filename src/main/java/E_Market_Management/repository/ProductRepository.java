package E_Market_Management.repository;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import E_Market_Management.entity.Product;

public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findByNameContaining(String keyword);
    List<Product> findByCategoryId(Long categoryId);

    List<Product> findByBrandId(Long brandId);
    
}