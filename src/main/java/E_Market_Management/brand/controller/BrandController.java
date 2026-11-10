package E_Market_Management.brand.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import E_Market_Management.brand.dto.BrandRequest;
import E_Market_Management.brand.dto.BrandResponse;
import E_Market_Management.brand.service.BrandService;
import jakarta.validation.Valid;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.PutMapping;
import io.swagger.v3.oas.annotations.Operation;




@RestController 
@RequestMapping("/api/brand")
public class BrandController {
    private final BrandService brandService;

    public BrandController(BrandService brandService) {
        this.brandService = brandService;
    }

    @PostMapping
    @Operation(
        summary = "Tạo thương hiệu",
        description = "Tạo thương hiệu mới từ tên, quốc gia và logo. Chỉ quản trị viên được phép thực hiện; tên thương hiệu đã tồn tại sẽ bị từ chối."
    )
    public ResponseEntity<BrandResponse> createBrand(@RequestBody @Valid BrandRequest request) {
        return ResponseEntity.ok(
            brandService.createBrand(request)
        );
    }

    @GetMapping
    @Operation(
        summary = "Lấy danh sách thương hiệu",
        description = "Trả về danh sách thương hiệu hiện có. Endpoint này cho phép truy cập công khai."
    )
    public ResponseEntity<List<BrandResponse>> getAllBrand() {
        return ResponseEntity.ok(
            brandService.getAllBrand()
        );
    }
    
    @GetMapping("/{id}")
    @Operation(
        summary = "Lấy thương hiệu theo ID",
        description = "Trả về thông tin thương hiệu tương ứng với ID; endpoint cho phép truy cập công khai."
    )
    public ResponseEntity<BrandResponse> getBrand(@PathVariable("id") Long brandId) {
        return ResponseEntity.ok(
            brandService.getBrand(brandId)
        );
    }

    @PutMapping("/{id}")
    @Operation(
        summary = "Cập nhật thương hiệu",
        description = "Cập nhật tên, quốc gia và logo của thương hiệu theo ID. Chỉ quản trị viên được phép thực hiện."
    )
    public ResponseEntity<BrandResponse> updateBrand(@PathVariable("id") Long brandId, @RequestBody @Valid BrandRequest request) {
        return ResponseEntity.ok(
            brandService.updateBrand(brandId, request)
        );
    }
    
    @DeleteMapping("/{id}")
    @Operation(
        summary = "Xóa thương hiệu",
        description = "Xóa thương hiệu theo ID. Chỉ quản trị viên được phép thực hiện; API trả về 204 khi xóa thành công."
    )
    public ResponseEntity<Void> deleteBrand(@PathVariable("id") Long brandId) {
        brandService.deleteBrand(brandId);
        return ResponseEntity.noContent().build();
    }
}
