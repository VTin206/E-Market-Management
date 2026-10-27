package E_Market_Management.category.service;


import java.util.List;

import org.springframework.stereotype.Service;

import E_Market_Management.cart.repository.CartItemRepository;
import E_Market_Management.category.dto.CategoryRequest;
import E_Market_Management.category.dto.CategoryResponse;
import E_Market_Management.category.entity.Category;
import E_Market_Management.category.mapper.CategoryMapper;
import E_Market_Management.category.repository.CategoryRepository;
import E_Market_Management.product.dto.ProductResponse;
import E_Market_Management.shared.exception.ConflictException;
import E_Market_Management.shared.exception.ResourceNotFoundException;

@Service 
public class CategoryService {
    private final CartItemRepository cartItemRepository;
    private final CategoryRepository categoryRepository;
    private final CategoryMapper categoryMapper;

    public CategoryService(
        CategoryRepository categoryRepository,
        CategoryMapper categoryMapper, CartItemRepository cartItemRepository
    ) {
        this.categoryRepository = categoryRepository;
        this.categoryMapper = categoryMapper;
        this.cartItemRepository = cartItemRepository;
    }

    public CategoryResponse createCategory(CategoryRequest request) {
        if(categoryRepository.findByName(request.getName()).isPresent()) {
            throw new ConflictException("Danh mục này đã tồn tại!");
        }

        Category category = Category.builder()
            .name(request.getName())
            .description(request.getDescription())
            .build();

        return categoryMapper.toResponse(categoryRepository.save(category));
    }

    public List<CategoryResponse> getAllCategory() {
        
        List<Category> categories = categoryRepository.findAll();
        
        if(categories.isEmpty()) {
            throw new ResourceNotFoundException("Hiện tại vẫn chưa có danh mục nào!");
        }

        List<CategoryResponse> responses = categories.stream()
            .map(category -> categoryMapper.toResponse(category))
            .toList();
        
        return responses;
    }

    public CategoryResponse updateCategory(Long categoryId, CategoryRequest request) {
        Category category = categoryRepository.findById(categoryId)
            .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy danh mục này!"));
    
        category.setName(request.getName());
        category.setDescription(request.getDescription());

        return categoryMapper.toResponse(categoryRepository.save(category));
    }
}
