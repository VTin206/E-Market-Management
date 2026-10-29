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
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.PutMapping;




@RestController 
@RequestMapping("/api/brand")
public class BrandController {
    private final BrandService brandService;

    public BrandController(BrandService brandService) {
        this.brandService = brandService;
    }

    @PostMapping
    public ResponseEntity<BrandResponse> createBrand(@RequestBody @Valid BrandRequest request) {
        return ResponseEntity.ok(
            brandService.createBrand(request)
        );
    }

    @GetMapping
    public ResponseEntity<List<BrandResponse>> getAllBrand() {
        return ResponseEntity.ok(
            brandService.getAllBrand()
        );
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<BrandResponse> getBrand(@PathVariable("id") Long brandId) {
        return ResponseEntity.ok(
            brandService.getBrand(brandId)
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<BrandResponse> updateBrand(@PathVariable Long brandId, @RequestBody BrandRequest request) {
        return ResponseEntity.ok(
            brandService.updateBrand(brandId, request)
        );
    }
    
    
}
