package E_Market_Management.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import E_Market_Management.dto.cart.AddToCartRequest;
import E_Market_Management.dto.cart.CartResponse;
import E_Market_Management.dto.cart.UpdateCartItemRequest;
import E_Market_Management.service.CartService;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/cart")
public class CartController {
    public final CartService cartService;
    public Long userId = 1L; //Tạm thời fix cứng

    public CartController(CartService cartService) {
        this.cartService = cartService;
    }

    @GetMapping
    public ResponseEntity<CartResponse> getCart() {
        return ResponseEntity.ok(
            cartService.getCart(userId)
        );
    }

    @PostMapping("/items")
    public ResponseEntity<CartResponse> addToCart(@Valid @RequestBody AddToCartRequest request) {
        CartResponse response = cartService.addToCart(userId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PatchMapping("/items/{itemId}")
    public ResponseEntity<CartResponse> updateCartItem(@PathVariable Long itemId, @Valid @RequestBody UpdateCartItemRequest request) {
        return ResponseEntity.ok(
            cartService.updateCartItem(userId, itemId, request)
        );
    }

    @DeleteMapping("/items/{itemId}")
    public ResponseEntity<CartResponse> removeItem(@PathVariable Long itemId) {
        return ResponseEntity.ok(
            cartService.removeItem(userId, itemId)
        );
    }
}
