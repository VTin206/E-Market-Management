package E_Market_Management.membership.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import E_Market_Management.auth.security.CustomUserDetails;
import E_Market_Management.membership.dto.MembershipCreateRequest;
import E_Market_Management.membership.dto.MembershipResponse;
import E_Market_Management.membership.service.MembershipService;
import jakarta.validation.Valid;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import io.swagger.v3.oas.annotations.Operation;




@RestController 
@RequestMapping("/api/membership")
public class MembershipController {
    
    private final MembershipService membershipService;

    MembershipController(MembershipService membershipService) {
        this.membershipService = membershipService;
    }

    @PostMapping
    @Operation(
        summary = "Tạo hạng thành viên",
        description = "Tạo hạng thành viên mới với số điểm yêu cầu và phần trăm ưu đãi. Chỉ quản trị viên được phép thực hiện; tên hạng đã tồn tại sẽ bị từ chối."
    )
    public ResponseEntity<MembershipResponse> createMembership(@RequestBody @Valid MembershipCreateRequest request) {
        return ResponseEntity.ok(
            membershipService.createMembership(request)
        );
    }

    @GetMapping
    @Operation(
        summary = "Lấy danh sách hạng thành viên",
        description = "Trả về danh sách hạng thành viên cùng điều kiện điểm và mức ưu đãi. Chỉ quản trị viên được phép truy cập."
    )
    public ResponseEntity<List<MembershipResponse>> getAllMembership() {
        return ResponseEntity.ok(
            membershipService.getAllMembership()
        );
    }
}
