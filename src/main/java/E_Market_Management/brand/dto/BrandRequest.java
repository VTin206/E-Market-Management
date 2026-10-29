package E_Market_Management.brand.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class BrandRequest {
    @NotBlank(message = "Vui lòng nhập tên thương hiệu")
    private String name;

    @NotBlank(message = "Vui lòng nhập quốc gia")
    private String country;

    @NotBlank(message = "Vui lòng tải ảnh thương hiệu!")
    private String logo;
}
