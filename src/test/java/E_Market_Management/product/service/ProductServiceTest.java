package E_Market_Management.product.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.math.BigDecimal;
import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import E_Market_Management.product.dto.ProductCreateRequest;
import E_Market_Management.product.dto.ProductResponse;
import E_Market_Management.product.entity.Brand;
import E_Market_Management.product.entity.Product;
import E_Market_Management.product.entity.Category;
import E_Market_Management.product.mapper.ProductMapper;
import E_Market_Management.product.repository.BrandRepository;
import E_Market_Management.product.repository.CategoryRepository;
import E_Market_Management.product.repository.ProductRepository;
import E_Market_Management.shared.exception.ResourceNotFoundException;
import jakarta.inject.Inject;

@ExtendWith(MockitoExtension.class)
public class ProductServiceTest {
    @Mock 
    private ProductRepository productRepository;

    @Mock 
    private CategoryRepository categoryRepository;

    @Mock 
    private BrandRepository brandRepository;

    @Mock 
    private ProductMapper productMapper;

    @InjectMocks 
    private ProductService productService;

    @Test 
    void getProductById_whenProductExists_shouldReturnProduct() {
        Product product = Product.builder()
            .id(1L)
            .name("iphone")
            .price(new BigDecimal("1000"))
            .stock(5)
            .build();
        
        ProductResponse expected = new ProductResponse(
            1L, "iphone", null, 
            new BigDecimal("1000"), 5,
            null, null, null
        );

        when(productRepository.findById(1L))
            .thenReturn(Optional.of(product));
        
        when(productMapper.toResponse(product))
            .thenReturn(expected);

        ProductResponse actual = productService.getProductById(1L);

        assertEquals(1L, actual.getId());
        assertEquals("iphone", actual.getName());
        verify(productRepository).findById(1L);
    }

    @Test 
    void getProductById_whenProductNotFound_throwsException() {
        when(productRepository.findById(999L))
            .thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, 
            () -> productService.getProductById(999L));
    }

    @Test 
    void createProduct_whenRequestValid_returnsCreatedProduct() {
        ProductCreateRequest request = new ProductCreateRequest();
        request.setName("  iPhone  ");
        request.setDescription("Phone Apple");
        request.setPrice(new BigDecimal("2000000"));
        request.setStock(10);
        request.setImageUrl("iphone.jpg");
        request.setCategoryId(1L);
        request.setBrandId(2L);

        Brand brand = Brand.builder()
            .id(2L)
            .name("Apple")
            .build();
        
        Category category = Category.builder()
            .id(1L)
            .name("Điện thoại")
            .build();

        Product savedProduct = Product.builder()
            .id(100L)
            .name("iPhone")
            .description("Phone Apple")
            .price(new BigDecimal("2000000"))
            .stock(10)
            .imageUrl("iphone.jpg")
            .category(category)
            .brand(brand)
            .build();

        ProductResponse expectedResponse = new ProductResponse(
            100L,
            "iphone",
            "Apple Iphone",
            new BigDecimal("2000000"),
            5,
            "iphone.jpg",
            null,
            null
        );

        when(categoryRepository.findById(1L))
            .thenReturn(Optional.of(category));
        
        when(brandRepository.findById(2L))
            .thenReturn(Optional.of(brand));

        when(productRepository.save(any(Product.class)))
            .thenReturn(savedProduct);

        when(productMapper.toResponse(savedProduct))
            .thenReturn(expectedResponse);
        
        ProductResponse actual = productService.createProduct(request);

        assertNotNull(actual);
        assertEquals(100L, actual.getId());
        assertEquals("iphone", actual.getName());
        assertEquals(new BigDecimal("2000000"), actual.getPrice());

        verify(categoryRepository).findById(1L);
        verify(brandRepository).findById(2L);
        verify(productRepository).save(any(Product.class));
        verify(productMapper).toResponse(savedProduct);
    }
}
