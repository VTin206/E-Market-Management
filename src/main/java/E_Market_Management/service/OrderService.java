package E_Market_Management.service;

import E_Market_Management.mapper.OrderMapper;
import E_Market_Management.repository.OrderItemRepository;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;

import E_Market_Management.dto.order.OrderCreateRequest;
import E_Market_Management.dto.order.OrderItemCreateRequest;
import E_Market_Management.dto.order.OrderResponse;
import E_Market_Management.entity.Order;
import E_Market_Management.entity.OrderItem;
import E_Market_Management.entity.Product;
import E_Market_Management.entity.User;
import E_Market_Management.exception.ResourceNotFoundException;
import E_Market_Management.repository.OrderRepository;
import E_Market_Management.repository.ProductRepository;
import E_Market_Management.repository.UserRepository;
import jakarta.transaction.Transactional;

@Service
public class OrderService {

    private final OrderMapper orderMapper;
    private final OrderItemRepository orderItemRepository;
    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;

    public OrderService(OrderRepository orderRepository, UserRepository userRepository, ProductRepository productRepository, OrderItemRepository orderItemRepository, OrderMapper orderMapper) {
        this.orderRepository = orderRepository;
        this.userRepository = userRepository;
        this.productRepository = productRepository;
        this.orderItemRepository = orderItemRepository;
        this.orderMapper = orderMapper;
    }

    @Transactional 
    public OrderResponse createOrder(Long userId, OrderCreateRequest request) {

        User user = userRepository.findById(userId)
            .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy người dùng có id " + userId));
        
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
        for (OrderItemCreateRequest itemRequest : request.getItems()) {
            Product product = productRepository.findById(itemRequest.getProductId())
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy sản phẩm có id " + itemRequest.getProductId()));
            
            if (itemRequest.getQuantity() > product.getStock()) {
                throw new IllegalArgumentException("Số lượng vượt quá tồn kho");
            }
            BigDecimal unitPrice = product.getPrice();

            OrderItem orderItem = OrderItem.builder()
                .order(order)
                .product(product)
                .quantity(itemRequest.getQuantity())
                .unitPrice(unitPrice)
                .build();

            orderItemRepository.save(orderItem);

            BigDecimal itemTotal = unitPrice.multiply(
                BigDecimal.valueOf(itemRequest.getQuantity())
            );

            totalAmount.add(itemTotal);
            product.setStock(product.getStock() - itemRequest.getQuantity());
            productRepository.save(product);
        }

        order.setTotalAmount(totalAmount);
        order = orderRepository.save(order);
        List<OrderItem> orderItems = orderItemRepository.findAllByOrder_Id(order.getId());
        return orderMapper.toResponse(order, orderItems);
    }
}
