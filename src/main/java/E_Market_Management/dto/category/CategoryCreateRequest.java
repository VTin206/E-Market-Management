package E_Market_Management.dto.category;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CategoryCreateRequest {
    @NotNull(message = "Tên phân loại không được để trống")
    private String name;

    private String description;
}
