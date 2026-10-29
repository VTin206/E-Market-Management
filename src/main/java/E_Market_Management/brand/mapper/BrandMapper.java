package E_Market_Management.brand.mapper;

import org.springframework.stereotype.Component;

import E_Market_Management.brand.dto.BrandRequest;
import E_Market_Management.brand.dto.BrandResponse;
import E_Market_Management.brand.entity.Brand;

@Component 
public class BrandMapper {
    public BrandResponse toResponse(Brand brand) {
        return BrandResponse.builder()
            .name(brand.getName())
            .country(brand.getCountry())
            .build();
    }
}
