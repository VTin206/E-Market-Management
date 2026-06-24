package E_Market_Management.dto.brand;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class BrandCreateRequest {
    @NotBlank(message = "Vui lòng nhập tên Brand")
    private String name;

    @NotBlank(message = "Vui lòng nhập quốc gia")
    private String country;
}
