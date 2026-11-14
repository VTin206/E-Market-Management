package E_Market_Management.cart.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import E_Market_Management.cart.dto.AddToCartRequest;
import E_Market_Management.cart.dto.CartResponse;
import E_Market_Management.cart.dto.UpdateCartItemRequest;
import E_Market_Management.cart.entity.Cart;
import E_Market_Management.cart.entity.CartItem;
import E_Market_Management.cart.repository.CartItemRepository;
import E_Market_Management.cart.repository.CartRepository;
import E_Market_Management.product.dto.ProductResponse;
import E_Market_Management.product.entity.Product;
import E_Market_Management.product.mapper.ProductMapper;
import E_Market_Management.product.repository.ProductRepository;
import E_Market_Management.shared.exception.ResourceNotFoundException;
import E_Market_Management.user.entity.User;
import E_Market_Management.user.repository.UserRepository;

@ExtendWith(MockitoExtension.class)
class CartServiceTest {

    @Mock
    private ProductMapper productMapper;

    @Mock
    private CartRepository cartRepository;

    @Mock
    private CartItemRepository cartItemRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private ProductRepository productRepository;

    @InjectMocks
    private CartService cartService;

    private User user;
    private Cart cart;
    private Product product;

    @BeforeEach
    void setUp() {
        user = User.builder().id(7L).userName("customer").build();
        cart = Cart.builder().id(20L).user(user).build();
        product = Product.builder()
            .id(11L)
            .name("Phone")
            .price(new BigDecimal("1000000"))
            .stock(5)
            .build();

    }

    @Test
    void addToCart_whenItemAlreadyExists_accumulatesQuantityWithinStock() {
        stubExistingCart();
        CartItem item = CartItem.builder()
            .id(30L)
            .cart(cart)
            .product(product)
            .quantity(2)
            .build();
        AddToCartRequest request = new AddToCartRequest();
        request.setProductId(11L);
        request.setQuantity(2);

        when(productRepository.findById(11L)).thenReturn(Optional.of(product));
        when(cartItemRepository.findByCart_IdAndProduct_Id(20L, 11L))
            .thenReturn(Optional.of(item));
        when(cartItemRepository.findAllByCart_Id(20L)).thenReturn(List.of(item));
        when(productMapper.toResponse(product)).thenReturn(productResponse());

        CartResponse response = cartService.addToCart(7L, request);

        assertEquals(4, item.getQuantity());
        assertEquals(1, response.getItems().size());
        assertEquals(4, response.getItems().get(0).getQuantity());
        verify(cartItemRepository).save(item);
    }

    @Test
    void addToCart_whenQuantityExceedsStock_rejectsAndDoesNotSave() {
        stubExistingCart();
        CartItem item = CartItem.builder()
            .id(30L)
            .cart(cart)
            .product(product)
            .quantity(4)
            .build();
        AddToCartRequest request = new AddToCartRequest();
        request.setProductId(11L);
        request.setQuantity(2);

        when(productRepository.findById(11L)).thenReturn(Optional.of(product));
        when(cartItemRepository.findByCart_IdAndProduct_Id(20L, 11L))
            .thenReturn(Optional.of(item));

        assertThrows(IllegalArgumentException.class, () -> cartService.addToCart(7L, request));

        assertEquals(4, item.getQuantity());
        verify(cartItemRepository, never()).save(any(CartItem.class));
    }

    @Test
    void getCart_mapsOnlyItemsFromRequestedUserCart() {
        stubExistingCart();
        CartItem item = CartItem.builder()
            .id(30L)
            .cart(cart)
            .product(product)
            .quantity(2)
            .build();
        when(cartItemRepository.findAllByCart_Id(20L)).thenReturn(List.of(item));
        when(productMapper.toResponse(product)).thenReturn(productResponse());

        CartResponse response = cartService.getCart(7L);

        assertEquals(20L, response.getId());
        assertEquals(7L, response.getUserId());
        assertEquals(1, response.getItems().size());
        assertEquals(30L, response.getItems().get(0).getId());
        assertEquals(2, response.getItems().get(0).getQuantity());
    }

    @Test
    void updateCartItem_whenItemBelongsToUser_updatesQuantity() {
        stubExistingCart();
        CartItem item = CartItem.builder()
            .id(30L)
            .cart(cart)
            .product(product)
            .quantity(1)
            .build();
        UpdateCartItemRequest request = new UpdateCartItemRequest();
        request.setQuantity(3);

        when(cartItemRepository.findByIdAndCart_User_Id(30L, 7L))
            .thenReturn(Optional.of(item));
        when(cartItemRepository.findAllByCart_Id(20L)).thenReturn(List.of(item));
        when(productMapper.toResponse(product)).thenReturn(productResponse());

        cartService.updateCartItem(7L, 30L, request);

        assertEquals(3, item.getQuantity());
        verify(cartItemRepository).save(item);
        verify(cartItemRepository).findByIdAndCart_User_Id(30L, 7L);
    }

    @Test
    void removeItem_whenItemBelongsToAnotherUser_throwsNotFound() {
        when(cartItemRepository.findByIdAndCart_User_Id(30L, 7L))
            .thenReturn(Optional.empty());

        assertThrows(
            ResourceNotFoundException.class,
            () -> cartService.removeItem(7L, 30L)
        );

        verify(cartItemRepository, never()).delete(any(CartItem.class));
    }

    private ProductResponse productResponse() {
        return new ProductResponse(
            product.getId(),
            product.getName(),
            null,
            product.getPrice(),
            product.getStock(),
            null,
            null,
            null
        );
    }

    private void stubExistingCart() {
        when(cartRepository.findByUser_Id(7L)).thenReturn(Optional.of(cart));
    }
}
