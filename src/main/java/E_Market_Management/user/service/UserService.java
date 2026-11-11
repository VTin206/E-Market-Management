package E_Market_Management.user.service;

import org.springframework.stereotype.Service;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.transaction.annotation.Transactional;

import E_Market_Management.shared.exception.ResourceNotFoundException;
import E_Market_Management.user.dto.UserResponse;
import E_Market_Management.user.dto.UserUpdateRequest;
import E_Market_Management.user.dto.UserUpdateRoleRequest;
import E_Market_Management.user.entity.User;
import E_Market_Management.user.mapper.UserMapper;
import E_Market_Management.user.repository.UserRepository;

@Service
public class UserService {
    private final UserRepository userRepository;
    private final UserMapper userMapper;

    public UserService(
        UserRepository userRepository,
        UserMapper userMapper
    ) {
        this.userRepository = userRepository;
        this.userMapper = userMapper;
    }

    @Transactional(readOnly = true)
    public UserResponse getUserProfile(Long userId) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy thông tin, vui lòng đăng nhập"));

        return userMapper.toResponse(user);
    }

    @Transactional(readOnly = true)
    public Page<UserResponse> getUsers(int page, int size) {
        if (page < 0) {
            throw new IllegalArgumentException("Page không được nhỏ hơn 0");
        }
        if (size < 1 || size > 100) {
            throw new IllegalArgumentException("Size phải nằm trong khoảng từ 1 đến 100");
        }
        return userRepository.findAll(PageRequest.of(page, size, Sort.by("id").ascending()))
            .map(userMapper::toResponse);
    }

    @Transactional
    public UserResponse updateUserProfile(Long userId, UserUpdateRequest request) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy thông tin người dùng!"));

        if (request.getFullName() != null) {
            user.setFullName(request.getFullName());
        }
        if (request.getUserName() != null) {
            user.setUserName(request.getUserName());
        }
        if (request.getEmail() != null) {
            user.setEmail(request.getEmail());
        }
        if (request.getPhone() != null) {
            user.setPhone(request.getPhone());
        }
        return userMapper.toResponse(userRepository.save(user));
    }

    @Transactional
    public UserResponse updateRole(Long userId, UserUpdateRoleRequest request) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy thông tin người dùng!"));

        user.setRole(request.getRole());
        return userMapper.toResponse(userRepository.save(user));
    }
}
