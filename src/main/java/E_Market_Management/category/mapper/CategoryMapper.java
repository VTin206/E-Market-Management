package E_Market_Management.category.mapper;

import org.springframework.stereotype.Component;

import E_Market_Management.category.dto.CategoryResponse;
import E_Market_Management.category.entity.Category;

@Component 
public class CategoryMapper {
    public CategoryResponse toResponse(Category category) {
        CategoryResponse response = CategoryResponse.builder()
            .id(category.getId())
            .description(category.getDescription())
            .name(category.getName())
            .build();

        return response;
    }
}
