package E_Market_Management.order.dto;

import E_Market_Management.order.entity.STATUS;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class UpdateOrderStatusRequest {
    @NotNull(message = "Trạng thái không được để trống")
    private STATUS status;
}
