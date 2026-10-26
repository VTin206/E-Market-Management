package E_Market_Management.product.mapper;

import org.springframework.stereotype.Component;

import E_Market_Management.brand.dto.BrandResponse;
import E_Market_Management.brand.entity.Brand;
import E_Market_Management.category.dto.CategoryResponse;
import E_Market_Management.category.entity.Category;
import E_Market_Management.product.dto.ProductResponse;
import E_Market_Management.product.entity.Product;

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
