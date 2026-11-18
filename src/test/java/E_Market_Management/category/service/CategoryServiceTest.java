package E_Market_Management.category.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import E_Market_Management.cart.repository.CartItemRepository;
import E_Market_Management.category.dto.CategoryRequest;
import E_Market_Management.category.dto.CategoryResponse;
import E_Market_Management.category.entity.Category;
import E_Market_Management.category.mapper.CategoryMapper;
import E_Market_Management.category.repository.CategoryRepository;
import E_Market_Management.shared.exception.ConflictException;
import E_Market_Management.shared.exception.ResourceNotFoundException;

@ExtendWith(MockitoExtension.class)
class CategoryServiceTest {

    @Mock
    private CartItemRepository cartItemRepository;

    @Mock
    private CategoryRepository categoryRepository;

    @Mock
    private CategoryMapper categoryMapper;

    @InjectMocks
    private CategoryService categoryService;

    @Test
    void createCategory_whenNameIsAvailable_savesAndMapsCategory() {
        CategoryRequest request = request("Phones", "Mobile phones");
        Category saved = Category.builder().id(1L).name("Phones").description("Mobile phones").build();
        CategoryResponse expected = CategoryResponse.builder().id(1L).name("Phones").build();

        when(categoryRepository.findByName("Phones")).thenReturn(Optional.empty());
        when(categoryRepository.save(any(Category.class))).thenReturn(saved);
        when(categoryMapper.toResponse(saved)).thenReturn(expected);

        CategoryResponse actual = categoryService.createCategory(request);

        assertEquals(expected, actual);
        verify(categoryRepository).save(any(Category.class));
        verify(categoryMapper).toResponse(saved);
    }

    @Test
    void createCategory_whenNameAlreadyExists_throwsConflictWithoutSaving() {
        when(categoryRepository.findByName("Phones"))
            .thenReturn(Optional.of(Category.builder().id(1L).name("Phones").build()));

        assertThrows(ConflictException.class, () -> categoryService.createCategory(request("Phones", "Mobile phones")));

        verify(categoryRepository, never()).save(any(Category.class));
    }

    @Test
    void getAllCategory_whenNoCategoriesExist_throwsNotFound() {
        when(categoryRepository.findAll()).thenReturn(List.of());

        assertThrows(ResourceNotFoundException.class, () -> categoryService.getAllCategory());
    }

    @Test
    void updateCategory_whenCategoryExists_updatesFieldsAndSaves() {
        Category category = Category.builder().id(1L).name("Old").description("Old description").build();
        CategoryRequest request = request("New", "New description");
        CategoryResponse expected = CategoryResponse.builder().id(1L).name("New").description("New description").build();

        when(categoryRepository.findById(1L)).thenReturn(Optional.of(category));
        when(categoryRepository.save(category)).thenReturn(category);
        when(categoryMapper.toResponse(category)).thenReturn(expected);

        CategoryResponse actual = categoryService.updateCategory(1L, request);

        assertEquals("New", category.getName());
        assertEquals("New description", category.getDescription());
        assertEquals(expected, actual);
        verify(categoryRepository).save(category);
    }

    @Test
    void deleteCategory_whenCategoryExists_deletesIt() {
        Category category = Category.builder().id(1L).name("Phones").build();
        when(categoryRepository.findById(1L)).thenReturn(Optional.of(category));

        categoryService.deleteCategory(1L);

        verify(categoryRepository).delete(category);
    }

    private CategoryRequest request(String name, String description) {
        CategoryRequest request = new CategoryRequest();
        request.setName(name);
        request.setDescription(description);
        return request;
    }
}
