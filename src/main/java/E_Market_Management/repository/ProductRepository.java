package E_Market_Management.repository;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import E_Market_Management.entity.Product;

public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findByNameContainingIgnoreCase(String keyword);
    List<Product> findByCategory_Id(Long categoryId);

    List<Product> findByBrand_Id(Long brandId);
    
}
