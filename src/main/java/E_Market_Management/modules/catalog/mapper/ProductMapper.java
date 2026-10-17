package E_Market_Management.modules.catalog.mapper;

import org.springframework.stereotype.Component;

import E_Market_Management.modules.catalog.dto.brand.BrandResponse;
import E_Market_Management.modules.catalog.dto.category.CategoryResponse;
import E_Market_Management.modules.catalog.dto.product.ProductResponse;
import E_Market_Management.modules.catalog.domain.Brand;
import E_Market_Management.modules.catalog.domain.Category;
import E_Market_Management.modules.catalog.domain.Product;

@Component
public class ProductMapper {

    public ProductResponse toResponse(Product product) {
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
