package E_Market_Management.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import E_Market_Management.dto.brand.BrandResponse;
import E_Market_Management.dto.category.CategoryResponse;
import E_Market_Management.dto.product.ProductCreateRequest;
import E_Market_Management.dto.product.ProductResponse;
import E_Market_Management.dto.product.ProductUpdateRequest;
import E_Market_Management.entity.Brand;
import E_Market_Management.entity.Category;
import E_Market_Management.entity.Product;
import E_Market_Management.exception.ResourceNotFoundException;
import E_Market_Management.repository.BrandRepository;
import E_Market_Management.repository.CategoryRepository;
import E_Market_Management.repository.ProductRepository;

@Service
public class ProductService {
    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final BrandRepository brandRepository;

    public ProductService(ProductRepository productRepository, CategoryRepository categoryRepository, BrandRepository brandRepository) {
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
        this.brandRepository = brandRepository;
    }

    @Transactional
    public ProductResponse createProduct(ProductCreateRequest request) {
        Category category = categoryRepository.findById(request.getCategoryId()).orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy danh mục"));

        Brand brand = brandRepository.findById(request.getBrandId()).orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy thương hiệu"));
        
        Product product = Product.builder()
                .name(request.getName().trim())
                .description(request.getDescription())
                .price(request.getPrice())
                .stock(request.getStock())
                .imageUrl(request.getImageUrl())
                .category(category)
                .brand(brand)
                .build();
        
        return toResponse(productRepository.save(product));
    }

    @Transactional
    public void deleteProduct(Long id) {
        Product product = productRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy sản phẩm"));

        productRepository.delete(product);
    }

    @Transactional
    public ProductResponse updateProduct(Long productId, ProductUpdateRequest updatedProduct) {
        Product product = productRepository.findById(productId).orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy sản phẩm có id " + productId));

        if(updatedProduct.getName() != null) {
            if(updatedProduct.getName().isBlank()) {
                throw new IllegalArgumentException("Tên sản phẩm không được để trống");
            }
            product.setName(updatedProduct.getName().trim());
        }

        if(updatedProduct.getDescription() != null) {
            product.setDescription(updatedProduct.getDescription());
        }

        if (updatedProduct.getPrice() != null) {
            product.setPrice(updatedProduct.getPrice());
        }

        if (updatedProduct.getStock() != null) {
        product.setStock(updatedProduct.getStock());
        }

        if (updatedProduct.getImageUrl() != null) {
            product.setImageUrl(updatedProduct.getImageUrl());
        }

        if (updatedProduct.getCategoryId() != null) {
            Category category = categoryRepository.findById(updatedProduct.getCategoryId()).orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy danh mục có id " + updatedProduct.getCategoryId()));
            product.setCategory(category);
        }

        if (updatedProduct.getBrandId() != null) {
            Brand brand = brandRepository.findById(updatedProduct.getBrandId()).orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy thương hiệu có id "+ updatedProduct.getBrandId()));
            product.setBrand(brand);
        }

        return toResponse(productRepository.save(product));
    }


    //mapper
    private ProductResponse toResponse(Product product) {
        Category category = product.getCategory();
        Brand brand = product.getBrand();

        CategoryResponse categoryResponse = CategoryResponse.builder()
                .id(category.getId())
                .name(category.getName())
                .description(category.getDescription())
                .build();

        BrandResponse brandResponse = BrandResponse.builder()
                .name(brand.getName())
                .country(brand.getCountry())
                .build();

        return new ProductResponse(
            product.getId(),
            product.getName(),
            product.getDescription(),
            product.getPrice(),
            product.getStock(),
            product.getImageUrl(),
            categoryResponse,
            brandResponse
        );
    }
}
