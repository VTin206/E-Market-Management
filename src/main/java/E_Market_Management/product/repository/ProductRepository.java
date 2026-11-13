package E_Market_Management.product.repository;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import E_Market_Management.product.entity.Product;

public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findByNameContainingIgnoreCase(String keyword);

    Page<Product> findByCategory_Id(Long categoryId, Pageable pageable);

    Page<Product> findByBrand_Id(Long brandId, Pageable pageable);

    Page<Product> findByCategory_IdAndBrand_Id(Long categoryId, Long brandId, Pageable pageable);

    //cân nhắc jpa specification khi có nhiều filter
    @Modifying
    @Query("""
        UPDATE Product p
        SET p.stock = p.stock - :quantity
        WHERE p.id = :id
        AND p.stock >= :quantity
    """)
    int decreaseStock(@Param("id") Long productId, @Param("quantity") int quantity);

    @Modifying
    @Query("""
        UPDATE Product p
        SET p.stock = p.stock + :quantity
        WHERE p.id = :id
    """)
    int increaseStock(@Param("id") Long productId, @Param("quantity") int quantity);
}
