package E_Market_Management.product.dto;

import java.math.BigDecimal;

import E_Market_Management.brand.dto.BrandResponse;
import E_Market_Management.category.dto.CategoryResponse;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class ProductResponse {
    private Long id;
    private String name;
    private String description;
    private BigDecimal price;
    private Integer stock;
    private String imageUrl;
    private CategoryResponse category;
    private BrandResponse brand;
}
