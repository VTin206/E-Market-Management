package E_Market_Management.order.mapper;

import java.util.List;

import org.springframework.stereotype.Component;

import E_Market_Management.order.dto.OrderItemResponse;
import E_Market_Management.order.dto.OrderResponse;
import E_Market_Management.order.entity.Order;
import E_Market_Management.order.entity.OrderItem;
import E_Market_Management.product.mapper.ProductMapper;

@Component 
public class OrderMapper {

    private final ProductMapper productMapper;

    public OrderMapper(ProductMapper productMapper) {
        this.productMapper = productMapper;
    }


    public OrderResponse toResponse(Order order, List<OrderItem> orderItems) {
        
        List<OrderItemResponse> itemResponses = orderItems.stream()
            .map(orderItem -> OrderItemResponse.builder()
                .id(orderItem.getId())
                .product(productMapper.toResponse(orderItem.getProduct()))
                .quantity(orderItem.getQuantity())
                .unitPrice(orderItem.getUnitPrice())
                .build())
            .toList();
        
        return OrderResponse.builder()
            .id(order.getId())
            .userId(order.getUser().getId())
            .customerName(order.getCustomerName())
            .phone(order.getPhone())
            .address(order.getAddress())
            .totalAmount(order.getTotalAmount())
            .status(order.getStatus())
            .createdAt(order.getCreatedAt())
            .items(itemResponses)
            .build();
    }
}
