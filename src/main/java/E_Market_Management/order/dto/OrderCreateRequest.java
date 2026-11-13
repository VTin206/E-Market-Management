package E_Market_Management.order.dto;

import java.util.List;

import E_Market_Management.order.entity.METHOD;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class OrderCreateRequest {
@NotBlank(message = "Tên khách hàng không được để trống")
    private String customerName;

    @NotBlank(message = "Số điện thoại không được để trống")
    private String phone;

    @NotBlank(message = "Địa chỉ không được để trống")
    private String address;

    @NotNull(message = "Vui lòng chọn phương thức thanh toán!")
    private METHOD paymentMethod;

    private List<@Valid OrderItemCreateRequest> items;
}
