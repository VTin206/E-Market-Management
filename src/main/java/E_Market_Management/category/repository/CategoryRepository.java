package E_Market_Management.category.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import E_Market_Management.category.entity.Category;

public interface CategoryRepository extends JpaRepository<Category, Long> {
}
