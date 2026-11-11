package E_Market_Management.user.mapper;

import org.springframework.stereotype.Component;

import E_Market_Management.membership.dto.MembershipResponse;
import E_Market_Management.membership.entity.Membership;
import E_Market_Management.user.dto.UserResponse;
import E_Market_Management.user.entity.User;

@Component
public class UserMapper {
    public UserResponse toResponse(User user) {
        Membership membership = user.getMembership();
        MembershipResponse membershipResponse = MembershipResponse.builder()
            .id(membership.getId())
            .name(membership.getName())
            .requiredPoints(membership.getRequiredPoints())
            .discountPercent(membership.getDiscountPercent())
            .build();

        UserResponse response = UserResponse.builder()
            .id(user.getId())
            .userName(user.getUserName())
            .fullName(user.getFullName())
            .email(user.getEmail())
            .phone(user.getPhone())
            .role(user.getRole())
            .membership(membershipResponse)
            .points(user.getPoints())
            .build();

        return response;
    }
}
