package E_Market_Management.product.repository;
import java.util.List;
import java.math.BigDecimal;

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

    @Query("""
        select p from Product p
        where (:categoryId is null or p.category.id = :categoryId)
          and (:brandId is null or p.brand.id = :brandId)
          and (
              :query is null
              or lower(p.name) like lower(concat('%', :query, '%'))
              or lower(coalesce(p.description, '')) like lower(concat('%', :query, '%'))
              or lower(p.category.name) like lower(concat('%', :query, '%'))
              or lower(p.brand.name) like lower(concat('%', :query, '%'))
          )
          and (:minPrice is null or p.price >= :minPrice)
          and (:maxPrice is null or p.price <= :maxPrice)
          and (
              :stockFilter is null
              or (:stockFilter = 'in-stock' and p.stock > 0)
              or (:stockFilter = 'out-of-stock' and p.stock <= 0)
          )
    """)
    Page<Product> search(
        @Param("categoryId") Long categoryId,
        @Param("brandId") Long brandId,
        @Param("query") String query,
        @Param("minPrice") BigDecimal minPrice,
        @Param("maxPrice") BigDecimal maxPrice,
        @Param("stockFilter") String stockFilter,
        Pageable pageable
    );

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
