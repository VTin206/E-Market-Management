package E_Market_Management.category.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import E_Market_Management.category.dto.CategoryCreateRequest;
import E_Market_Management.category.dto.CategoryResponse;
import E_Market_Management.category.service.CategoryService;
import E_Market_Management.product.dto.ProductResponse;
import jakarta.validation.Valid;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;


@RestController 
@RequestMapping("/api/category") 
public class CategoryController {
    
    private final CategoryService categoryService;

    public CategoryController(CategoryService categoryService) {
        this.categoryService = categoryService;
    }

    @PostMapping
    public ResponseEntity<CategoryResponse> createCategory(@RequestBody @Valid CategoryCreateRequest request) {
        return ResponseEntity.ok(
            categoryService.createCategory(request)
        );
    }
}
