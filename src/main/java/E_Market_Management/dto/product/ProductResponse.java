package E_Market_Management.dto.product;

import java.math.BigDecimal;

import E_Market_Management.dto.brand.BrandResponse;
import E_Market_Management.dto.category.CategoryResponse;
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
