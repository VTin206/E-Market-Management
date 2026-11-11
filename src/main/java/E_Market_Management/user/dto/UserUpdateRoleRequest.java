package E_Market_Management.user.dto;

import E_Market_Management.user.entity.ROLE;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserUpdateRoleRequest {
    @NotNull(message = "Role không được để trống")
    private ROLE role;
}
