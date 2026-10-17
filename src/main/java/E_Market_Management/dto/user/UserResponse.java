package E_Market_Management.dto.user;

import E_Market_Management.dto.membership.MembershipResponse;
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
    private String role;
    private Integer points;

    private MembershipResponse membership;
}
