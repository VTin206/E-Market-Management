package E_Market_Management.user.service;

import org.springframework.stereotype.Service;
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
