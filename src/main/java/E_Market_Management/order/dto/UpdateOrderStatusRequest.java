package E_Market_Management.order.dto;

import E_Market_Management.order.entity.STATUS;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class UpdateOrderStatusRequest {
    @NotNull(message = "Trạng thái không được để trống")
    private STATUS status;

    @Size(max = 100)
    private String shippingCarrier;

    @Size(max = 150)
    private String carrierTrackingNumber;
}
