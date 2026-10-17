package E_Market_Management.service;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import E_Market_Management.dto.auth.AuthResponse;
import E_Market_Management.dto.auth.LoginRequest;
import E_Market_Management.dto.auth.RegisterRequest;
import E_Market_Management.entity.ROLE;
import E_Market_Management.entity.User;
import E_Market_Management.repository.UserRepository;
import E_Market_Management.security.CustomUserDetails;
import E_Market_Management.security.CustomUserDetailsService;
import E_Market_Management.security.JwtService;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final CustomUserDetailsService userDetailsService;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtService jwtService, AuthenticationManager authenticationManager, CustomUserDetailsService userDetailsService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.authenticationManager = authenticationManager;
        this.userDetailsService = userDetailsService;
    }

    public AuthResponse register(RegisterRequest request) {

        if(userRepository.existsByUserName(request.getUserName())) {
            throw new IllegalArgumentException("Username đã tồn tại!");
        }

        if(userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email đã tồn tại");
        }

        User user = User.builder()
            .userName(request.getUserName())
            .password(passwordEncoder.encode(request.getPassword()))
            .fullName(request.getFullName())
            .email(request.getEmail())
            .phone(request.getPhone())
            .role(ROLE.CUSTOMER)
            .points(0)
            .build();
        
        User savedUser = userRepository.save(user);
        String token = jwtService.generateToken(new CustomUserDetails(savedUser));

        return new AuthResponse(token, "Bearer");
    }

    public AuthResponse login(LoginRequest request) {

        authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(
                request.getUserName(),
                request.getPassword()
            )
        );

        UserDetails userDetails = userDetailsService.loadUserByUsername(request.getUserName());
        String token = jwtService.generateToken(userDetails);

        return new AuthResponse(token, "Bearer");
    }
}
