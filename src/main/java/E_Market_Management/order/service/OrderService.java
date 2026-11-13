package E_Market_Management.order.service;

import E_Market_Management.cart.repository.CartItemRepository;
import E_Market_Management.cart.repository.CartRepository;
import E_Market_Management.membership.entity.Membership;
import E_Market_Management.membership.entity.MembershipTier;
import E_Market_Management.membership.repository.MembershipRepository;
import E_Market_Management.order.mapper.OrderMapper;
import E_Market_Management.order.repository.OrderItemRepository;
import E_Market_Management.order.repository.PaymentRepository;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Objects;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.stereotype.Service;

import E_Market_Management.auth.security.CustomUserDetails;
import E_Market_Management.cart.entity.Cart;
import E_Market_Management.cart.entity.CartItem;
import E_Market_Management.order.dto.CheckOutLine;
import E_Market_Management.order.dto.OrderCreateRequest;
import E_Market_Management.order.dto.OrderResponse;
import E_Market_Management.order.dto.UpdateOrderStatusRequest;
import E_Market_Management.order.entity.Order;
import E_Market_Management.order.entity.OrderItem;
import E_Market_Management.order.entity.Payment;
import E_Market_Management.order.entity.METHOD;
import E_Market_Management.order.entity.PAYMENT_STATUS;
import E_Market_Management.order.entity.STATUS;
import E_Market_Management.order.repository.OrderRepository;
import E_Market_Management.product.entity.Product;
import E_Market_Management.product.repository.ProductRepository;
import E_Market_Management.shared.exception.ResourceNotFoundException;
import E_Market_Management.shared.exception.ConflictException;
import E_Market_Management.user.entity.User;
import E_Market_Management.user.repository.UserRepository;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class OrderService {

    private final OrderMapper orderMapper;
    private final OrderItemRepository orderItemRepository;
    private final PaymentRepository paymentRepository;
    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final MembershipRepository membershipRepository;

    public OrderService(
        OrderRepository orderRepository, 
        UserRepository userRepository, 
        ProductRepository productRepository, 
        OrderItemRepository orderItemRepository, 
        PaymentRepository paymentRepository,
        OrderMapper orderMapper, 
        CartRepository cartRepository,
        CartItemRepository cartItemRepository,
        MembershipRepository membershipRepository
    ) {
        this.orderRepository = orderRepository;
        this.userRepository = userRepository;
        this.productRepository = productRepository;
        this.orderItemRepository = orderItemRepository;
        this.paymentRepository = paymentRepository;
        this.orderMapper = orderMapper;
        this.cartRepository = cartRepository;
        this.cartItemRepository = cartItemRepository;
        this.membershipRepository = membershipRepository;
    }


    private void updateMembership(User user, int updatedPoint) {
        MembershipTier updatedTier = MembershipTier.MEMBER;

        for(MembershipTier tier : MembershipTier.values()) {
            if(updatedPoint >= tier.getRequiredPoints()) {
                updatedTier = tier;
            }
        }

        Membership membership = membershipRepository.findByTier(updatedTier)
            .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy hạng thành viên"));

        user.setMembership(membership);
    }

    private void awardPoint(Order order) {
        User user = order.getUser();
        if(user == null) return;

        int earnedPoint = order.getTotalAmount()
            .divideToIntegralValue(BigDecimal.valueOf(10_000))
            .intValueExact();

        int currentPoint = user.getPoints() == null ? 0 : user.getPoints();
        int updatedPoint = currentPoint + earnedPoint;

        user.setPoints(updatedPoint);

        updateMembership(user, updatedPoint);
        userRepository.save(user);
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
            .trackingCode(UUID.randomUUID())
            .phone(request.getPhone())
            .address(request.getAddress())
            .status(STATUS.PENDING)
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

        Payment payment = paymentRepository.save(Payment.builder()
            .methodName(request.getPaymentMethod())
            .status(request.getPaymentMethod() == METHOD.BANK_TRANSFER
                ? PAYMENT_STATUS.PENDING
                : PAYMENT_STATUS.UNPAID)
            .order(order)
            .build());
        order.setPayment(payment);

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
    public Page<OrderResponse> getAllOrders(int page, int size) {
        if (page < 0) {
            throw new IllegalArgumentException("Số trang phải lớn hơn hoặc bằng 0");
        }
        if (size < 1 || size > 100) {
            throw new IllegalArgumentException("Kích thước trang phải từ 1 đến 100");
        }

        Pageable pageable = PageRequest.of(
            page,
            size,
            Sort.by(Sort.Direction.DESC, "createdAt")
                .and(Sort.by(Sort.Direction.DESC, "id"))
        );
        Page<Order> orders = orderRepository.findAll(pageable);
        return orders.map(
            order -> {
                List<OrderItem> items = orderItemRepository.findAllByOrder_Id(order.getId());
                return orderMapper.toResponse(order, items);
            }
        );
    }

    @Transactional 
    public OrderResponse updateStatus(UpdateOrderStatusRequest request, Long orderId) {
        Order order = orderRepository.findById(orderId)
            .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy đơn hàng!"));

        STATUS currentStatus = order.getStatus();
        STATUS nextStatus = request.getStatus();

        if (!order.getStatus().canTransitionTo(nextStatus)) {
            throw new ConflictException(
                "Không thể chuyển trạng thái đơn hàng từ " + order.getStatus() + " sang " + nextStatus
            );
        }

        boolean justCompleted = currentStatus != STATUS.COMPLETED && nextStatus == STATUS.COMPLETED;
        boolean justCancelled = currentStatus != STATUS.CANCELLED && nextStatus == STATUS.CANCELLED;

        order.setStatus(nextStatus);

        if(justCompleted) {
            awardPoint(order);
        }

        if(justCancelled) {
            List<OrderItem> items = orderItemRepository.findAllByOrder_Id(orderId);
            for(OrderItem item : items) {
                Product product = item.getProduct();
                int currentStock = product.getStock();
                int restock = item.getQuantity();
                product.setStock(currentStock + restock);
                productRepository.save(product);
            }
        }

        orderRepository.save(order);
        return orderMapper.toResponse(order, order.getOrderItems());
    }

    @Transactional 
    public OrderResponse getCurrentOrder(Long orderId, CustomUserDetails userDetails) {
        Order order = orderRepository.findById(orderId)
            .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy đơn hàng!"));

        Long userId = userDetails.getId();
        Collection<? extends GrantedAuthority> authorities = userDetails.getAuthorities();

        boolean isAdmin = authorities.stream()
            .anyMatch(authority -> authority.getAuthority().equals("ROLE_ADMIN"));
        boolean isOwner = order.getUser() != null && userId.equals(order.getUser().getId());

        if(!isAdmin && !isOwner) {
            throw new ResponseStatusException(
                HttpStatus.FORBIDDEN,
                "Bạn không có quyền xem đơn hàng này!"
            );
        }

        return orderMapper.toResponse(order, order.getOrderItems());
    }

    @Transactional
    public OrderResponse cancelOrder(Long orderId, Long userId) {
        Order order = orderRepository.findById(orderId)
            .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy đơn hàng!"));

        if (order.getUser() == null || !Objects.equals(order.getUser().getId(), userId)) {
            throw new ResponseStatusException(
                HttpStatus.FORBIDDEN,
                "Bạn không có quyền hủy đơn hàng này!"
            );
        }

        if (order.getStatus() != STATUS.PENDING) {
            throw new ConflictException("Chỉ hủy được đơn ở trạng thái PENDING");
        }

        order.setStatus(STATUS.CANCELLED);

        List<OrderItem> items = orderItemRepository.findAllByOrder_Id(orderId);
        for(OrderItem item : items) {
            Product product = item.getProduct();
            int currentStock = product.getStock();
            int restock = item.getQuantity();
            product.setStock(currentStock + restock);
            productRepository.save(product);
        }

        return orderMapper.toResponse(orderRepository.save(order), items);
    }

    @Transactional 
    public OrderResponse trackOrder(UUID trackingCode) {
        Order order = orderRepository.findByTrackingCode(trackingCode)
            .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy đơn hàng!"));

        List<OrderItem> items = orderItemRepository.findAllByOrder_Id(order.getId());
        return orderMapper.toResponse(order, items);
    }
}
