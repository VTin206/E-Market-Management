package E_Market_Management.user.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;

import E_Market_Management.shared.exception.ResourceNotFoundException;
import E_Market_Management.user.dto.UserResponse;
import E_Market_Management.user.dto.UserUpdateRequest;
import E_Market_Management.user.dto.UserUpdateRoleRequest;
import E_Market_Management.user.entity.ROLE;
import E_Market_Management.user.entity.User;
import E_Market_Management.user.mapper.UserMapper;
import E_Market_Management.user.repository.UserRepository;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private UserMapper userMapper;

    @InjectMocks
    private UserService userService;

    @Test
    void getUserProfile_whenUserExists_returnsMappedResponse() {
        User user = user(7L, ROLE.CUSTOMER);
        UserResponse expected = UserResponse.builder().id(7L).userName("customer").build();
        when(userRepository.findById(7L)).thenReturn(Optional.of(user));
        when(userMapper.toResponse(user)).thenReturn(expected);

        UserResponse actual = userService.getUserProfile(7L);

        assertEquals(expected, actual);
        verify(userMapper).toResponse(user);
    }

    @Test
    void getUserProfile_whenUserDoesNotExist_throwsNotFound() {
        when(userRepository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> userService.getUserProfile(99L));
    }

    @Test
    void getUsers_whenArgumentsAreValid_usesRequestedPageAndMapsUsers() {
        User first = user(1L, ROLE.CUSTOMER);
        User second = user(2L, ROLE.ADMIN);
        Page<User> users = new PageImpl<>(List.of(first, second));
        when(userRepository.findAll(any(Pageable.class))).thenReturn(users);
        when(userMapper.toResponse(first)).thenReturn(UserResponse.builder().id(1L).build());
        when(userMapper.toResponse(second)).thenReturn(UserResponse.builder().id(2L).build());

        Page<UserResponse> actual = userService.getUsers(1, 20);

        assertEquals(2, actual.getNumberOfElements());
        assertEquals(List.of(1L, 2L), actual.getContent().stream().map(UserResponse::getId).toList());
        verify(userRepository).findAll(any(Pageable.class));
    }

    @Test
    void getUsers_whenPageOrSizeIsInvalid_rejectsRequest() {
        assertThrows(IllegalArgumentException.class, () -> userService.getUsers(-1, 20));
        assertThrows(IllegalArgumentException.class, () -> userService.getUsers(0, 0));
        assertThrows(IllegalArgumentException.class, () -> userService.getUsers(0, 101));

        verify(userRepository, never()).findAll(any(Pageable.class));
    }

    @Test
    void updateUserProfile_whenOnlySomeFieldsAreProvided_preservesOtherFields() {
        User user = user(7L, ROLE.CUSTOMER);
        user.setFullName("Old name");
        user.setEmail("old@example.com");
        user.setPhone("0900000000");
        UserUpdateRequest request = new UserUpdateRequest();
        request.setFullName("New name");
        request.setEmail("new@example.com");
        UserResponse expected = UserResponse.builder().id(7L).fullName("New name").build();

        when(userRepository.findById(7L)).thenReturn(Optional.of(user));
        when(userRepository.save(user)).thenReturn(user);
        when(userMapper.toResponse(user)).thenReturn(expected);

        UserResponse actual = userService.updateUserProfile(7L, request);

        assertEquals("New name", user.getFullName());
        assertEquals("new@example.com", user.getEmail());
        assertEquals("customer", user.getUserName());
        assertEquals("0900000000", user.getPhone());
        assertEquals(expected, actual);
        verify(userRepository).save(user);
    }

    @Test
    void updateRole_whenUserExists_updatesRoleAndSaves() {
        User user = user(7L, ROLE.CUSTOMER);
        UserUpdateRoleRequest request = new UserUpdateRoleRequest();
        request.setRole(ROLE.ADMIN);
        UserResponse expected = UserResponse.builder().id(7L).role(ROLE.ADMIN).build();

        when(userRepository.findById(7L)).thenReturn(Optional.of(user));
        when(userRepository.save(user)).thenReturn(user);
        when(userMapper.toResponse(user)).thenReturn(expected);

        UserResponse actual = userService.updateRole(7L, request);

        assertEquals(ROLE.ADMIN, user.getRole());
        assertEquals(expected, actual);
        verify(userRepository).save(user);
    }

    private User user(Long id, ROLE role) {
        return User.builder().id(id).userName(id == 1L ? "first" : "customer").role(role).build();
    }
}
