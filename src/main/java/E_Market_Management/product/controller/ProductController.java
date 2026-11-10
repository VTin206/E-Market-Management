package E_Market_Management.product.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.data.domain.Page;

import E_Market_Management.product.dto.ProductCreateRequest;
import E_Market_Management.product.dto.ProductResponse;
import E_Market_Management.product.dto.ProductUpdateRequest;
import E_Market_Management.product.service.ProductService;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/products")
public class ProductController {
    private final ProductService productService;

    public ProductController(ProductService productService){
        this.productService = productService;
    }

    @GetMapping
    @Operation(
        summary = "Lấy danh sách sản phẩm",
        description = "Trả về một trang sản phẩm, có thể lọc theo categoryId, brandId hoặc đồng thời cả hai. page bắt đầu từ 0 (mặc định 0), size mặc định 10; kết quả sắp xếp theo ID tăng dần. Endpoint công khai."
    )
    public ResponseEntity<Page<ProductResponse>> getAllProducts(
        @RequestParam(required = false) Long categoryId,
        @RequestParam(required = false) Long brandId,
        @RequestParam(defaultValue = "10") int size,
        @RequestParam(defaultValue = "0") int page
    ) {
        return ResponseEntity.ok(
            productService.getAllProducts(categoryId, brandId, page, size)
        );
    }

    @GetMapping("/{id}")
    @Operation(
        summary = "Lấy sản phẩm theo ID",
        description = "Trả về thông tin sản phẩm theo ID. Endpoint công khai."
    )
    public ResponseEntity<ProductResponse> getProductById(@PathVariable Long id) {
        return ResponseEntity.ok(
            productService.getProductById(id)
        );
    }

    @PostMapping
    @Operation(
        summary = "Tạo sản phẩm",
        description = "Tạo sản phẩm mới với thông tin, giá, tồn kho, danh mục và thương hiệu. Chỉ quản trị viên được phép thực hiện."
    )
    public ResponseEntity<ProductResponse> createProduct (@Valid @RequestBody ProductCreateRequest request) {
        ProductResponse response = productService.createProduct(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/{id}")
    @Operation(
        summary = "Cập nhật sản phẩm",
        description = "Cập nhật các trường sản phẩm được gửi trong yêu cầu theo ID. Chỉ quản trị viên được phép thực hiện."
    )
    public ResponseEntity<ProductResponse> updateProduct (@PathVariable Long id, @Valid @RequestBody ProductUpdateRequest request) {
        return ResponseEntity.ok(
            productService.updateProduct(id, request)
        );
    }

    @DeleteMapping("/{id}")
    @Operation(
        summary = "Xóa sản phẩm",
        description = "Xóa sản phẩm theo ID. Chỉ quản trị viên được phép thực hiện; API trả về 204 khi xóa thành công."
    )
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
        return ResponseEntity.noContent().build();
    }
}
