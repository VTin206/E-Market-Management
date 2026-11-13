package E_Market_Management.order.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import E_Market_Management.order.entity.METHOD;
import E_Market_Management.order.entity.PAYMENT_STATUS;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderResponse {
    private Long id;
    private Long userId;
    private String customerName;
    private String phone;
    private String address;
    private BigDecimal totalAmount;
    private String status;
    private LocalDateTime createdAt;
    private METHOD paymentMethod;
    private PAYMENT_STATUS paymentStatus;
    private UUID trackingCode;

    private List<OrderItemResponse> items;
}
