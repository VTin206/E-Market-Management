package E_Market_Management.modules.catalog.repository;

import E_Market_Management.modules.catalog.domain.Category;

import org.springframework.data.jpa.repository.JpaRepository;

public interface CategoryRepository extends JpaRepository<Category, Long>{
    
}
