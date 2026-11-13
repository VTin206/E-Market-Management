package E_Market_Management.order.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertSame;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.mock;
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

import E_Market_Management.auth.security.CustomUserDetails;
import E_Market_Management.membership.entity.Membership;
import E_Market_Management.membership.entity.MembershipTier;
import E_Market_Management.membership.repository.MembershipRepository;
import E_Market_Management.order.dto.OrderResponse;
import E_Market_Management.order.dto.UpdateOrderStatusRequest;
import E_Market_Management.order.entity.Order;
import E_Market_Management.order.entity.OrderItem;
import E_Market_Management.order.entity.STATUS;
import E_Market_Management.order.mapper.OrderMapper;
import E_Market_Management.order.repository.OrderItemRepository;
import E_Market_Management.order.repository.OrderRepository;
import E_Market_Management.shared.exception.ResourceNotFoundException;
import E_Market_Management.shared.exception.ConflictException;
import E_Market_Management.user.entity.ROLE;
import E_Market_Management.user.entity.User;
import E_Market_Management.user.repository.UserRepository;

@ExtendWith(MockitoExtension.class)
public class OrderServiceTest {
    @Mock 
    private OrderRepository orderRepository;

    @Mock 
    private OrderMapper orderMapper;

    @Mock 
    private OrderItemRepository orderItemRepository;

    @Mock
    private MembershipRepository membershipRepository;

    @Mock
    private UserRepository userRepository;

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
        
        User customer = User.builder()
            .id(7L)
            .userName("tester")
            .password("hash")
            .role(ROLE.CUSTOMER)
            .build();
        CustomUserDetails userDetails = new CustomUserDetails(customer);

        Order order = Order.builder()
            .id(1L)
            .customerName("Văn Tin")
            .phone("0378786152")
            .address("Quận 3, TP HCM")
            .totalAmount(new BigDecimal("200000"))
            .status(STATUS.PENDING)
            .createdAt(LocalDateTime.of(2026, 10, 24, 10, 0))
            .user(customer)
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

        OrderResponse actualResponse = orderService.getCurrentOrder(1L, userDetails);

        assertEquals(expectedResponse.getId(), 1L);
        assertEquals(expectedResponse.getCustomerName(), actualResponse.getCustomerName());
        assertSame(expectedResponse, actualResponse);
        assertEquals(expectedResponse.getStatus(), actualResponse.getStatus());
        assertEquals(expectedResponse.getTotalAmount(), actualResponse.getTotalAmount());
    
        verify(orderRepository).findById(1L);
        verify(orderMapper).toResponse(order, orderItems);
    }

    @Test 
    public void getCurrentOrder_whenOrderNotExist_throwResourceNotFoundException() {
        when(orderRepository.findById(1L))
            .thenReturn(Optional.empty());

        User customer = User.builder()
            .id(7L)
            .userName("tester")
            .password("hash")
            .role(ROLE.CUSTOMER)
            .build();
        CustomUserDetails userDetails = new CustomUserDetails(customer);
        
        assertThrows(ResourceNotFoundException.class, () -> orderService.getCurrentOrder(1L, userDetails));
    }

    @Test
    public void updateStatus_whenTransitionIsAllowed_updatesStatus() {
        List<OrderItem> items = List.of();
        Order order = Order.builder().id(5L).status(STATUS.PENDING).orderItems(items).build();
        UpdateOrderStatusRequest request = new UpdateOrderStatusRequest();
        request.setStatus(STATUS.PROCESSING);
        OrderResponse expected = OrderResponse.builder().id(5L).status("PROCESSING").build();

        when(orderRepository.findByIdForUpdate(5L)).thenReturn(Optional.of(order));
        when(orderRepository.save(order)).thenReturn(order);
        when(orderMapper.toResponse(order, items)).thenReturn(expected);

        OrderResponse actual = orderService.updateStatus(request, 5L);

        assertSame(expected, actual);
        assertEquals(STATUS.PROCESSING, order.getStatus());
        verify(orderRepository).findByIdForUpdate(5L);
        verify(orderRepository).save(order);
    }

    @Test
    public void updateStatus_whenTransitionIsNotAllowed_throwsConflict() {
        Order order = Order.builder().id(5L).status(STATUS.PENDING).orderItems(List.of()).build();
        UpdateOrderStatusRequest request = new UpdateOrderStatusRequest();
        request.setStatus(STATUS.COMPLETED);
        when(orderRepository.findByIdForUpdate(5L)).thenReturn(Optional.of(order));

        assertThrows(ConflictException.class, () -> orderService.updateStatus(request, 5L));
        assertEquals(STATUS.PENDING, order.getStatus());
    }

    @Test
    public void updateStatus_whenOrderCompletes_awardsPointsAndUpdatesTierOnce() {
        User user = User.builder().points(0).build();
        List<OrderItem> items = List.of();
        Order order = Order.builder()
            .id(8L)
            .user(user)
            .totalAmount(new BigDecimal("5000000"))
            .status(STATUS.DELIVERED)
            .orderItems(items)
            .build();
        Membership silverMembership = mock(Membership.class);
        UpdateOrderStatusRequest request = new UpdateOrderStatusRequest();
        request.setStatus(STATUS.COMPLETED);

        when(orderRepository.findByIdForUpdate(8L)).thenReturn(Optional.of(order));
        when(membershipRepository.findByTier(MembershipTier.SILVER))
            .thenReturn(Optional.of(silverMembership));

        orderService.updateStatus(request, 8L);
        orderService.updateStatus(request, 8L);

        assertEquals(500, user.getPoints());
        assertSame(silverMembership, user.getMembership());
        verify(membershipRepository).findByTier(MembershipTier.SILVER);
        verify(userRepository).save(user);
    }
}
