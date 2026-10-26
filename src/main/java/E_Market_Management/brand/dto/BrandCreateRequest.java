package E_Market_Management.brand.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class BrandCreateRequest {
    @NotBlank(message = "Vui lòng nhập tên thương hiệu")
    private String name;

    @NotBlank(message = "Vui lòng nhập quốc gia")
    private String country;
}
