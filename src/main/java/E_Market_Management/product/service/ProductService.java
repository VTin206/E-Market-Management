package E_Market_Management.product.service;

import java.util.List;
import java.math.BigDecimal;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import E_Market_Management.brand.entity.Brand;
import E_Market_Management.brand.repository.BrandRepository;
import E_Market_Management.category.entity.Category;
import E_Market_Management.category.repository.CategoryRepository;
import E_Market_Management.product.dto.ProductCreateRequest;
import E_Market_Management.product.dto.ProductResponse;
import E_Market_Management.product.dto.ProductUpdateRequest;
import E_Market_Management.product.entity.Product;
import E_Market_Management.product.mapper.ProductMapper;
import E_Market_Management.product.repository.ProductRepository;
import E_Market_Management.shared.exception.ResourceNotFoundException;

@Service
public class ProductService {
    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final BrandRepository brandRepository;
    private final ProductMapper productMapper;

    public ProductService(ProductRepository productRepository, CategoryRepository categoryRepository,
            BrandRepository brandRepository, ProductMapper productMapper) {
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
        this.brandRepository = brandRepository;
        this.productMapper = productMapper;
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
        
        return productMapper.toResponse(productRepository.save(product));
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

        return productMapper.toResponse(productRepository.save(product));
    }

    @Transactional(readOnly = true)
    public Page<ProductResponse> getAllProducts(
        Long categoryId,
        Long brandId,
        String query,
        BigDecimal minPrice,
        BigDecimal maxPrice,
        String stockFilter,
        String sort,
        int page,
        int size
    ) {
        if (page < 0) throw new IllegalArgumentException("Page không được nhỏ hơn 0");
        if (size < 1 || size > 100) throw new IllegalArgumentException("Size phải nằm trong khoảng từ 1 đến 100");
        if (minPrice != null && maxPrice != null && minPrice.compareTo(maxPrice) > 0) {
            throw new IllegalArgumentException("Khoảng giá không hợp lệ");
        }
        if (stockFilter != null && !stockFilter.equals("in-stock") && !stockFilter.equals("out-of-stock")) {
            throw new IllegalArgumentException("Bộ lọc tồn kho không hợp lệ");
        }

        String normalizedQuery = query == null || query.isBlank() ? null : query.trim();
        Pageable pageable = PageRequest.of(page, size, productSort(sort));
        Page<Product> products = productRepository.search(
            categoryId,
            brandId,
            normalizedQuery,
            minPrice,
            maxPrice,
            stockFilter,
            pageable
        );

        return products.map(productMapper::toResponse);
    }

    private Sort productSort(String sort) {
        return switch (sort == null ? "default" : sort) {
            case "price-asc" -> Sort.by("price").ascending().and(Sort.by("id").ascending());
            case "price-desc" -> Sort.by("price").descending().and(Sort.by("id").ascending());
            case "name-asc" -> Sort.by("name").ascending().and(Sort.by("id").ascending());
            case "stock-desc" -> Sort.by("stock").descending().and(Sort.by("id").ascending());
            case "default" -> Sort.by("id").ascending();
            default -> throw new IllegalArgumentException("Cách sắp xếp không hợp lệ");
        };
    }

    @Transactional(readOnly = true)
    public ProductResponse getProductById(Long id) {
        Product product = productRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy sản phẩm có id "+ id));
        return productMapper.toResponse(product);
    }
}
