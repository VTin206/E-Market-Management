package E_Market_Management.user.dto;

import E_Market_Management.membership.dto.MembershipResponse;
import E_Market_Management.user.entity.ROLE;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserResponse {
    private Long id;
    private String userName;
    private String fullName;
    private String email;
    private String phone;
    private ROLE role;
    private Integer points;

    private MembershipResponse membership;
}
