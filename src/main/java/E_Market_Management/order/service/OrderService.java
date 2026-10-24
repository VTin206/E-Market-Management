package E_Market_Management.order.service;

import E_Market_Management.cart.repository.CartItemRepository;
import E_Market_Management.cart.repository.CartRepository;
import E_Market_Management.order.mapper.OrderMapper;
import E_Market_Management.order.repository.OrderItemRepository;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import E_Market_Management.cart.entity.Cart;
import E_Market_Management.cart.entity.CartItem;
import E_Market_Management.order.dto.CheckOutLine;
import E_Market_Management.order.dto.OrderCreateRequest;
import E_Market_Management.order.dto.OrderResponse;
import E_Market_Management.order.dto.UpdateOrderStatusRequest;
import E_Market_Management.order.entity.Order;
import E_Market_Management.order.entity.OrderItem;
import E_Market_Management.order.repository.OrderRepository;
import E_Market_Management.product.entity.Product;
import E_Market_Management.product.repository.ProductRepository;
import E_Market_Management.shared.exception.ResourceNotFoundException;
import E_Market_Management.user.entity.User;
import E_Market_Management.user.repository.UserRepository;
import org.springframework.transaction.annotation.Transactional;

@Service
public class OrderService {

    private final OrderMapper orderMapper;
    private final OrderItemRepository orderItemRepository;
    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;

    public OrderService(
        OrderRepository orderRepository, 
        UserRepository userRepository, 
        ProductRepository productRepository, 
        OrderItemRepository orderItemRepository, 
        OrderMapper orderMapper, 
        CartRepository cartRepository,
        CartItemRepository cartItemRepository) {
        this.orderRepository = orderRepository;
        this.userRepository = userRepository;
        this.productRepository = productRepository;
        this.orderItemRepository = orderItemRepository;
        this.orderMapper = orderMapper;
        this.cartRepository = cartRepository;
        this.cartItemRepository = cartItemRepository;
    }

    @Transactional 
    public OrderResponse createOrder(Long userId, OrderCreateRequest request) {
        User user = null;
        Cart cart = null;
        List<CheckOutLine> lines;

        //Xử lý 2 trường hợp user có tài khoản và khách vãng lai
        if(userId != null) {
            user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy người dùng"));

            cart = cartRepository.findByUser_Id(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Giỏ hàng không tồn tại"));

            List<CartItem> cartItems = cartItemRepository.findAllByCart_Id(cart.getId());

            if(cartItems.isEmpty()) {
                throw new IllegalArgumentException("Giỏ hàng đang trống, hãy thêm sản phẩm vào giỏ hàng");
            }

            lines = cartItems.stream()
                .map(item -> new CheckOutLine(
                    item.getProduct().getId(), 
                    item.getQuantity())
                ).toList();
        } else {
            if(request.getItems() == null || request.getItems().isEmpty()) {
                throw new IllegalArgumentException("Khách chưa đăng nhập phải gửi sản phẩm đặt hàng");
            }

            lines = request.getItems().stream()
                .map(item -> new CheckOutLine(
                    item.getProductId(), 
                    item.getQuantity())
                ).toList();
        }

        //tạo entity đơn hàng
        Order order = Order.builder()
            .user(user)
            .customerName(request.getCustomerName())
            .phone(request.getPhone())
            .address(request.getAddress())
            .status("PENDING")
            .createdAt(LocalDateTime.now())
            .totalAmount(BigDecimal.ZERO)
            .build();
        
        order = orderRepository.save(order);

        BigDecimal totalAmount = BigDecimal.ZERO;
        List<OrderItem> orderItems = new ArrayList<>();

        for(CheckOutLine line : lines) {
            Product product = productRepository.findById(line.getProductId())
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy sản phẩm"));

            if(line.getQuantity() < 1) {
                throw new IllegalArgumentException("Số lượng sản phẩm không hợp lệ");
            }

            if(line.getQuantity() > product.getStock()) {
                throw new IllegalArgumentException("Sản phẩm " + product.getName() + " Không đủ tồn kho");
            }

            BigDecimal unitPrice = product.getPrice();
            orderItems.add(
                OrderItem.builder()
                    .quantity(line.getQuantity())
                    .unitPrice(unitPrice)
                    .order(order)
                    .product(product)
                    .build()
            );

            totalAmount = totalAmount.add(
                unitPrice.multiply(
                    BigDecimal.valueOf(line.getQuantity())
                )
            );

            product.setStock(product.getStock() - line.getQuantity());

        }
        orderItemRepository.saveAll(orderItems);
        order.setTotalAmount(totalAmount);
        orderRepository.save(order);

        if(cart != null) {
            cartItemRepository.deleteAllByCart_Id(cart.getId());
        }
        return orderMapper.toResponse(order, orderItems);
    }

    @Transactional(readOnly = true)
    public List<OrderResponse> getOrdersByUserId(Long userId) {

        return orderRepository.findAllByUser_Id(userId)
            .stream()
            .map(order -> orderMapper.toResponse(order, orderItemRepository.findAllByOrder_Id(order.getId())
            ))
            .toList();
    }

    @Transactional(readOnly = true)
    public List<OrderResponse> getAllOrders() {
        List<Order> orders = orderRepository.findAll();
        List<OrderResponse> responses = orders.stream()
            .map(order -> {
                List<OrderItem> orderItem = orderItemRepository.findAllByOrder_Id(order.getId());
                return orderMapper.toResponse(order, orderItem);
            })
            .toList();
        
        return responses;
    }

    @Transactional 
    public OrderResponse updateStatus(UpdateOrderStatusRequest request, Long orderId) {
        Order order = orderRepository.findById(orderId)
            .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy đơn hàng!"));
        
        order.setStatus(request.getStatus());
        orderRepository.save(order);
        return orderMapper.toResponse(order, order.getOrderItems());
    }

    @Transactional 
    public OrderResponse getCurrentOrder(Long orderId) {
        Order order = orderRepository.findById(orderId)
            .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy đơn hàng!"));
        
        return orderMapper.toResponse(order, order.getOrderItems());
    }
}
