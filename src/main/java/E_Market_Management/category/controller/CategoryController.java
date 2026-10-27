package E_Market_Management.category.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import E_Market_Management.category.dto.CategoryRequest;
import E_Market_Management.category.dto.CategoryResponse;
import E_Market_Management.category.service.CategoryService;
import jakarta.validation.Valid;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PutMapping;




@RestController 
@RequestMapping("/api/category") 
public class CategoryController {
    
    private final CategoryService categoryService;

    public CategoryController(CategoryService categoryService) {
        this.categoryService = categoryService;
    }

    @PostMapping
    public ResponseEntity<CategoryResponse> createCategory(@RequestBody @Valid CategoryRequest request) {
        return ResponseEntity.ok(
            categoryService.createCategory(request)
        );
    }

    @GetMapping
    public ResponseEntity<List<CategoryResponse>> getAllCategory() {
        return ResponseEntity.ok(
            categoryService.getAllCategory()
        );
    }
    

    @PutMapping("/{id}")
    public ResponseEntity<CategoryResponse> updateCategory(
        @PathVariable("id") Long categoryId, 
        @RequestBody @Valid CategoryRequest categoryRequest
    ) {
        return ResponseEntity.ok(
            categoryService.updateCategory(categoryId, categoryRequest)
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCategory(@PathVariable("id") Long categoryId) {
        categoryService.deleteCategory(categoryId);
        return ResponseEntity.noContent().build();
    } 

    @GetMapping("/{id}")
    public ResponseEntity<CategoryResponse> getCategory(
        @PathVariable("id") Long categoryId
    ) {
        return ResponseEntity.ok(
            categoryService.getCategory(categoryId)
        );
    }

}
