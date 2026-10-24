package E_Market_Management.order.controller;

import org.springframework.web.bind.annotation.RestController;

import E_Market_Management.auth.security.CustomUserDetails;
import E_Market_Management.order.dto.OrderCreateRequest;
import E_Market_Management.order.dto.OrderResponse;
import E_Market_Management.order.dto.UpdateOrderStatusRequest;
import E_Market_Management.order.service.OrderService;
import jakarta.validation.Valid;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.PathVariable;




@RestController 
@RequestMapping("/api/orders")
public class OrderController {
    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @PostMapping
    public ResponseEntity<OrderResponse> createOrder(@AuthenticationPrincipal CustomUserDetails userDetails, @Valid @RequestBody OrderCreateRequest request) {
        Long userId = (userDetails != null) ? userDetails.getId() : null;
        OrderResponse response = orderService.createOrder(userId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
  
    @GetMapping("/me")
    public ResponseEntity<List<OrderResponse>> getAllMyOrders(
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        return ResponseEntity.ok(
            orderService.getOrdersByUserId(userDetails.getId())
        );
    }

    @GetMapping
    public ResponseEntity<List<OrderResponse>> getAllOrders() {
        return ResponseEntity.ok(
            orderService.getAllOrders()
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity updateStatus(
        @RequestBody @Valid UpdateOrderStatusRequest request,
        @PathVariable("id") Long orderId 
    ) {
        return ResponseEntity.ok(
            orderService.updateStatus(request, orderId)
        );
    }
}
