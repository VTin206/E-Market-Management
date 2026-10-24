package E_Market_Management.order.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertSame;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import E_Market_Management.order.dto.OrderResponse;
import E_Market_Management.order.entity.Order;
import E_Market_Management.order.entity.OrderItem;
import E_Market_Management.order.mapper.OrderMapper;
import E_Market_Management.order.repository.OrderItemRepository;
import E_Market_Management.order.repository.OrderRepository;
import E_Market_Management.user.entity.User;

@ExtendWith(MockitoExtension.class)
public class OrderServiceTest {
    @Mock 
    private OrderRepository orderRepository;

    @Mock 
    private OrderMapper orderMapper;

    @Mock 
    private OrderItemRepository orderItemRepository;

    @InjectMocks 
    private OrderService orderService;

    @Test 
    public void getCurrentOrder_whenOrderExists_returnOrderResponse() {
        List<OrderItem> orderItems = List.of(
            OrderItem.builder()
                .id(10L)
                .quantity(2)
                .unitPrice(new BigDecimal("100000"))
                .build()
        );
        

        Order order = Order.builder()
            .id(1L)
            .customerName("Văn Tin")
            .phone("0378786152")
            .address("Quận 3, TP HCM")
            .totalAmount(new BigDecimal("200000"))
            .status("PENDING")
            .createdAt(LocalDateTime.of(2026, 10, 24, 10, 0))
            .orderItems(orderItems)
            .build();

        OrderResponse expectedResponse = OrderResponse.builder()
            .id(1L)    
            .customerName("Văn Tin")
            .phone("0378786152")
            .address("Quận 3, TP HCM")
            .totalAmount(new BigDecimal("200000"))
            .status("PENDING")
            .createdAt(LocalDateTime.of(2026, 10, 24, 10, 0))
            .build();

        when(orderRepository.findById(1L))
            .thenReturn(Optional.of(order));

        when(orderMapper.toResponse(order, orderItems))
            .thenReturn(expectedResponse);

        OrderResponse actualResponse = orderService.getCurrentOrder(1L);

        assertEquals(expectedResponse.getId(), 1L);
        assertEquals(expectedResponse.getCustomerName(), expectedResponse.getCustomerName());
        assertSame(expectedResponse, actualResponse);
        assertEquals(expectedResponse.getStatus(), actualResponse.getStatus());
        assertEquals(expectedResponse.getTotalAmount(), actualResponse.getTotalAmount());
    
        verify(orderRepository).findById(1L);
        verify(orderMapper).toResponse(order, orderItems);
    }
}
