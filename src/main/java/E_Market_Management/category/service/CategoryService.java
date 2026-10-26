package E_Market_Management.category.service;


import java.util.List;

import org.springframework.stereotype.Service;

import E_Market_Management.category.dto.CategoryCreateRequest;
import E_Market_Management.category.dto.CategoryResponse;
import E_Market_Management.category.entity.Category;
import E_Market_Management.category.mapper.CategoryMapper;
import E_Market_Management.category.repository.CategoryRepository;
import E_Market_Management.product.dto.ProductResponse;
import E_Market_Management.shared.exception.ConflictException;

@Service 
public class CategoryService {
    private final CategoryRepository categoryRepository;
    private final CategoryMapper categoryMapper;

    public CategoryService(
        CategoryRepository categoryRepository,
        CategoryMapper categoryMapper
    ) {
        this.categoryRepository = categoryRepository;
        this.categoryMapper = categoryMapper;
    }

    public CategoryResponse createCategory(CategoryCreateRequest request) {
        if(categoryRepository.findByName(request.getName()).isPresent()) {
            throw new ConflictException("Danh mục này đã tồn tại!");
        }

        Category category = Category.builder()
            .name(request.getName())
            .description(request.getDescription())
            .build();

        return categoryMapper.toResponse(categoryRepository.save(category));
    }
}
