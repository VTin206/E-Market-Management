package E_Market_Management.dto.membership;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class MembershipCreateRequest {
    @NotBlank(message = "Tên membership không được để trống")
    private String name;

    @Min(0)
    @Max(100)
    private Integer discountPercent;

    @Min(0)
    private Integer requiredPoints;
}
