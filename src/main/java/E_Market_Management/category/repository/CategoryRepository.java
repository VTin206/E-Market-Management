package E_Market_Management.category.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import E_Market_Management.category.entity.Category;
import E_Market_Management.product.entity.Product;

public interface CategoryRepository extends JpaRepository<Category, Long> {
    Optional<Category> findByName(String name);

    List<Category> getAllCategories();
}
