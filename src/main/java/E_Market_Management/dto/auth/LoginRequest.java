package E_Market_Management.dto.auth;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class LoginRequest {
    @NotBlank(message = "Vui lòng nhập tên đăng nhập")
    private String userName;

    @NotBlank(message = "Vui lòng nhập mật khẩu")
    private String password;
}
