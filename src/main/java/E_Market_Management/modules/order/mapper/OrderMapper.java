package E_Market_Management.modules.order.mapper;

import java.util.List;

import org.springframework.stereotype.Component;

import E_Market_Management.modules.catalog.mapper.ProductMapper;
import E_Market_Management.modules.order.dto.OrderItemResponse;
import E_Market_Management.modules.order.dto.OrderResponse;
import E_Market_Management.modules.order.domain.Order;
import E_Market_Management.modules.order.domain.OrderItem;

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
