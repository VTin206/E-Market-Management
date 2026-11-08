package E_Market_Management.product.repository;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import E_Market_Management.product.entity.Product;

public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findByNameContainingIgnoreCase(String keyword);

    Page<Product> findByCategory_Id(Long categoryId, Pageable pageable);

    Page<Product> findByBrand_Id(Long brandId, Pageable pageable);
    
    Page<Product> findByCategory_IdAndBrand_Id(Long categoryId, Long brandId, Pageable pageable);

    //cân nhắc jpa specification khi có nhiều filter
}
