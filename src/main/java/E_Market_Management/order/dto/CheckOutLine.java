package E_Market_Management.order.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data 
@AllArgsConstructor
@NoArgsConstructor 
public class CheckOutLine {
    private Long productId;
    private int quantity;
}
