package E_Market_Management.service;

import java.util.List;

import org.springframework.stereotype.Service;

import E_Market_Management.dto.cart.AddToCartRequest;
import E_Market_Management.dto.cart.CartItemResponse;
import E_Market_Management.dto.cart.CartResponse;
import E_Market_Management.dto.cart.UpdateCartItemRequest;
import E_Market_Management.entity.Cart;
import E_Market_Management.entity.CartItem;
import E_Market_Management.entity.Product;
import E_Market_Management.entity.User;
import E_Market_Management.exception.ResourceNotFoundException;
import E_Market_Management.mapper.ProductMapper;
import E_Market_Management.repository.CartItemRepository;
import E_Market_Management.repository.CartRepository;
import E_Market_Management.repository.ProductRepository;
import E_Market_Management.repository.UserRepository;
import jakarta.transaction.Transactional;

@Service
public class CartService {
    private final ProductMapper productMapper;
    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;

    public CartService(CartRepository cartRepository, CartItemRepository cartItemRepository, UserRepository userRepository, ProductRepository productRepository, ProductMapper productMapper) {
        this.cartRepository = cartRepository;
        this.cartItemRepository = cartItemRepository;
        this.userRepository = userRepository;
        this.productRepository = productRepository;
        this.productMapper = productMapper;
    }

    private Cart getOrCreateCart(Long userId) { //Kiểm tra có giỏ hàng chưa, nếu chưa thì tạo giỏ hàng
        return cartRepository.findByUser_Id(userId)
            .orElseGet(() -> {
                User user = userRepository.findById(userId)
                    .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy người dùng có id " + userId));
            
                Cart cart = Cart.builder()
                    .user(user)
                    .build();  
                    
                return cartRepository.save(cart);
            });
    }

    //Kiểm tra tồn kho
    private void validateStock(Product product, Integer quantity) {
        if(quantity > product.getStock()) {
            throw new IllegalArgumentException("Số lượng yêu cầu vượt quá tồn kho. " + "Tồn kho hiện tại: " + product.getStock());
        }
    }

    @Transactional 
    public CartResponse addToCart (Long userId, AddToCartRequest request) {
        Cart cart = getOrCreateCart(userId);

        Product product = productRepository
            .findById(request.getProductId())
            .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy sản phẩm: " + request.getProductId()));
        
        //kiểm tra sản phẩm đax thêm trước đó chưa nếu chưa thì khởi tạo cartitem
        CartItem cartItem = cartItemRepository
            .findByCart_IdAndProduct_Id(
                cart.getId(), 
                product.getId()
            )
            .orElseGet(() -> CartItem.builder()
                .cart(cart)
                .product(product)
                .quantity(0)
                .build()
            );
        
        int newQuantity = cartItem.getQuantity() + request.getQuantity();

        validateStock(cartItem.getProduct(), newQuantity);

        cartItem.setQuantity(newQuantity);
        cartItemRepository.save(cartItem);
        
        return getCart(userId);
    }

    @Transactional
    public CartResponse getCart(Long userId) {
        Cart cart = getOrCreateCart(userId);
        List<CartItemResponse> items = cartItemRepository
            .findAllByCart_Id(cart.getId())
            .stream()
            .map(this::toCartItemResponse)
            .toList();
        
        return CartResponse.builder()
            .id(cart.getId())
            .userId(userId)
            .items(items)
            .build();
    }

    @Transactional
    public CartResponse removeItem(Long userId, Long itemId) {
        CartItem cartItem = cartItemRepository
            .findByIdAndCart_User_Id(itemId, userId)
            .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy sản phẩm trong giỏ hàng"));

        cartItemRepository.delete(cartItem);
        return getCart(userId);
    }

    @Transactional
    public CartResponse updateCartItem(Long userId, Long itemId, UpdateCartItemRequest request) {
        CartItem cartItem = cartItemRepository
            .findByIdAndCart_User_Id(itemId, userId)
            .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy sản phẩm trong giỏ hàng"));

        validateStock(cartItem.getProduct(), request.getQuantity());

        cartItem.setQuantity(request.getQuantity());
        cartItemRepository.save(cartItem);

        return getCart(userId);
    }

    private CartItemResponse toCartItemResponse(CartItem cartItem) {
        return CartItemResponse.builder()
            .id(cartItem.getId())
            .product(productMapper.toResponse(cartItem.getProduct()))
            .quantity(cartItem.getQuantity())
            .build();
    }
}
