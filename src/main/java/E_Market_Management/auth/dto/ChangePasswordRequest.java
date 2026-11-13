package E_Market_Management.auth.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ChangePasswordRequest {
    @NotBlank (message = "Vui lòng nhập mật khẩu hiện tại!")
    private String currentPassword;

    @NotBlank(message = "Vui lòng nhập mật khẩu mới!")
    @Size(min = 6, message = "Mật khẩu phải có ít nhất 6 kí tự!")
    private String newPassword;
}
