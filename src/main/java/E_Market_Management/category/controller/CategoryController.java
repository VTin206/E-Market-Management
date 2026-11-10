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
import io.swagger.v3.oas.annotations.Operation;




@RestController 
@RequestMapping("/api/category") 
public class CategoryController {
    
    private final CategoryService categoryService;

    public CategoryController(CategoryService categoryService) {
        this.categoryService = categoryService;
    }

    @PostMapping
    @Operation(
        summary = "Tạo danh mục sản phẩm",
        description = "Tạo danh mục mới từ tên và mô tả. Chỉ quản trị viên được phép thực hiện; tên danh mục đã tồn tại sẽ bị từ chối."
    )
    public ResponseEntity<CategoryResponse> createCategory(@RequestBody @Valid CategoryRequest request) {
        return ResponseEntity.ok(
            categoryService.createCategory(request)
        );
    }

    @GetMapping
    @Operation(
        summary = "Lấy danh sách danh mục",
        description = "Trả về các danh mục sản phẩm hiện có. Endpoint cho phép truy cập công khai."
    )
    public ResponseEntity<List<CategoryResponse>> getAllCategory() {
        return ResponseEntity.ok(
            categoryService.getAllCategory()
        );
    }
    

    @PutMapping("/{id}")
    @Operation(
        summary = "Cập nhật danh mục",
        description = "Cập nhật tên và mô tả của danh mục theo ID. Chỉ quản trị viên được phép thực hiện."
    )
    public ResponseEntity<CategoryResponse> updateCategory(
        @PathVariable("id") Long categoryId, 
        @RequestBody @Valid CategoryRequest categoryRequest
    ) {
        return ResponseEntity.ok(
            categoryService.updateCategory(categoryId, categoryRequest)
        );
    }

    @DeleteMapping("/{id}")
    @Operation(
        summary = "Xóa danh mục",
        description = "Xóa danh mục theo ID. Chỉ quản trị viên được phép thực hiện; API trả về 204 khi xóa thành công."
    )
    public ResponseEntity<Void> deleteCategory(@PathVariable("id") Long categoryId) {
        categoryService.deleteCategory(categoryId);
        return ResponseEntity.noContent().build();
    } 

    @GetMapping("/{id}")
    @Operation(
        summary = "Lấy danh mục theo ID",
        description = "Trả về thông tin danh mục theo ID. Endpoint cho phép truy cập công khai."
    )
    public ResponseEntity<CategoryResponse> getCategory(
        @PathVariable("id") Long categoryId
    ) {
        return ResponseEntity.ok(
            categoryService.getCategory(categoryId)
        );
    }

}
