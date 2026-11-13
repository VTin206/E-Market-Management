package E_Market_Management.order.controller;

import org.springframework.web.bind.annotation.RestController;

import E_Market_Management.auth.security.CustomUserDetails;
import E_Market_Management.order.dto.OrderCreateRequest;
import E_Market_Management.order.dto.OrderResponse;
import E_Market_Management.order.dto.UpdateOrderStatusRequest;
import E_Market_Management.order.service.OrderService;
import jakarta.validation.Valid;

import java.util.List;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.PathVariable;
import io.swagger.v3.oas.annotations.Operation;




@RestController 
@RequestMapping("/api/orders")
public class OrderController {
    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @PostMapping
    @Operation(
        summary = "Tạo đơn hàng",
        description = "Tạo đơn hàng ở trạng thái chờ xử lý. Khách chưa đăng nhập gửi các sản phẩm trong yêu cầu; tài khoản đã đăng nhập đặt hàng từ giỏ hàng của mình. Endpoint cho phép đặt hàng không cần xác thực."
    )
    public ResponseEntity<OrderResponse> createOrder(@AuthenticationPrincipal CustomUserDetails userDetails, @Valid @RequestBody OrderCreateRequest request) {
        Long userId = (userDetails != null) ? userDetails.getId() : null;
        OrderResponse response = orderService.createOrder(userId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
  
    @GetMapping("/me")
    @Operation(
        summary = "Lấy đơn hàng của tài khoản hiện tại",
        description = "Trả về danh sách đơn hàng thuộc tài khoản đang đăng nhập, kèm các dòng sản phẩm. Yêu cầu xác thực."
    )
    public ResponseEntity<List<OrderResponse>> getAllMyOrders(
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        return ResponseEntity.ok(
            orderService.getOrdersByUserId(userDetails.getId())
        );
    }

    @GetMapping
    @Operation(
        summary = "Lấy toàn bộ đơn hàng",
        description = "Trả về một trang đơn hàng trong hệ thống. Chỉ quản trị viên được phép truy cập."
    )
    public ResponseEntity<Page<OrderResponse>> getAllOrders(
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "10") int size
    ) {
        return ResponseEntity.ok(
            orderService.getAllOrders(page, size)
        );
    }

    @GetMapping("/{id}")
    @Operation(
        summary = "Lấy đơn hàng theo ID",
        description = "Trả về chi tiết đơn hàng nếu người dùng đang đăng nhập là chủ đơn hoặc quản trị viên. Yêu cầu xác thực."
    )
    public ResponseEntity<OrderResponse> getCurrentOrder(
        @PathVariable("id") Long orderId,
        @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        return ResponseEntity.ok(
            orderService.getCurrentOrder(orderId, userDetails)
        );
    }

    @PutMapping("/{id}")
    @Operation(
        summary = "Cập nhật trạng thái đơn hàng",
        description = "Cập nhật trạng thái đơn hàng theo ID nếu chuyển trạng thái hợp lệ. Chỉ quản trị viên được phép thực hiện."
    )
    public ResponseEntity<OrderResponse> updateStatus(
        @RequestBody @Valid UpdateOrderStatusRequest request,
        @PathVariable("id") Long orderId 
    ) {
        return ResponseEntity.ok(
            orderService.updateStatus(request, orderId)
        );
    }

    @PostMapping("/{id}/cancel")
    @Operation(
        summary = "Hủy đơn hàng",
        description = "Cho phép chủ đơn hủy đơn hàng đang ở trạng thái PENDING. Hệ thống chuyển trạng thái sang CANCELLED và hoàn số lượng sản phẩm vào kho. Yêu cầu xác thực."
    )
    public ResponseEntity<OrderResponse> cancelOrder(
        @PathVariable("id") Long orderId,
        @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        Long userId = userDetails.getId();
        return ResponseEntity.ok(
            orderService.cancelOrder(orderId, userId)
        );
    }

    @PostMapping("/track")
    @Operation(
        summary = "Tra cứu đơn hàng bằng mã vận đơn",
        description = "Tìm đơn hàng theo trackingCode dạng UUID và trả về thông tin đơn hàng cùng các sản phẩm. Endpoint công khai, không yêu cầu xác thực."
    )
    public ResponseEntity<OrderResponse> trackOrder(@RequestParam UUID trackingCode) {
       return ResponseEntity.ok(
            orderService.trackOrder(trackingCode)
       );
    }
    

}
