package E_Market_Management.order.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import E_Market_Management.auth.security.CustomUserDetails;
import E_Market_Management.order.dto.OrderCreateRequest;
import E_Market_Management.order.dto.OrderResponse;
import E_Market_Management.order.service.OrderService;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @GetMapping
    public ResponseEntity<List<OrderResponse>> getAllMyOrders(
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        return ResponseEntity.ok(
            orderService.getOrdersByUserId(userDetails.getId())
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<OrderResponse> getMyOrder(
        @PathVariable Long id,
        @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        return ResponseEntity.ok(
            orderService.getOrder(userDetails.getId(), id)
        );
    }

    @PostMapping
    public ResponseEntity<OrderResponse> createOrder(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @Valid @RequestBody OrderCreateRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(orderService.createOrder(userDetails.getId(), request));
    }

}
