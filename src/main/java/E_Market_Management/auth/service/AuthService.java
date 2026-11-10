package E_Market_Management.auth.service;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import E_Market_Management.auth.dto.AuthResponse;
import E_Market_Management.auth.dto.LoginRequest;
import E_Market_Management.auth.dto.RegisterRequest;
import E_Market_Management.auth.security.CustomUserDetails;
import E_Market_Management.auth.security.CustomUserDetailsService;
import E_Market_Management.auth.security.JwtService;
import E_Market_Management.membership.entity.MembershipTier;
import E_Market_Management.membership.repository.MembershipRepository;
import E_Market_Management.shared.exception.ConflictException;
import E_Market_Management.user.entity.ROLE;
import E_Market_Management.user.entity.User;
import E_Market_Management.user.repository.UserRepository;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final MembershipRepository membershipRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final CustomUserDetailsService userDetailsService;

    public AuthService(UserRepository userRepository, MembershipRepository membershipRepository, PasswordEncoder passwordEncoder, JwtService jwtService, AuthenticationManager authenticationManager, CustomUserDetailsService userDetailsService) {
        this.userRepository = userRepository;
        this.membershipRepository = membershipRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.authenticationManager = authenticationManager;
        this.userDetailsService = userDetailsService;
    }

    public AuthResponse register(RegisterRequest request) {

        if(userRepository.existsByUserName(request.getUserName())) {
            throw new ConflictException("Username đã tồn tại!");
        }

        if(userRepository.existsByEmail(request.getEmail())) {
            throw new ConflictException("Email đã tồn tại");
        }

        User user = User.builder()
            .userName(request.getUserName())
            .password(passwordEncoder.encode(request.getPassword()))
            .fullName(request.getFullName())
            .email(request.getEmail())
            .phone(request.getPhone())
            .role(ROLE.CUSTOMER)
            .points(0)
            .membership(membershipRepository.findByTier(MembershipTier.MEMBER)
                .orElseThrow(() -> new IllegalStateException("Thiếu hạng thành viên mặc định")))
            .build();
        
        User savedUser = userRepository.save(user);
        String token = jwtService.generateToken(new CustomUserDetails(savedUser));

        return new AuthResponse(token, "Bearer", savedUser.getRole().name());
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
        String role = userDetails.getAuthorities().stream()
            .map(authority -> authority.getAuthority())
            .filter(authority -> authority.startsWith("ROLE_"))
            .findFirst()
            .map(authority -> authority.substring("ROLE_".length()))
            .orElse("CUSTOMER");

        return new AuthResponse(token, "Bearer", role);
    }
}
