package E_Market_Management.membership.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import E_Market_Management.membership.dto.MembershipResponse;
import E_Market_Management.membership.service.MembershipService;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import io.swagger.v3.oas.annotations.Operation;




@RestController 
@RequestMapping("/api/membership")
public class MembershipController {
    
    private final MembershipService membershipService;

    MembershipController(MembershipService membershipService) {
        this.membershipService = membershipService;
    }

    @GetMapping
    @Operation(
        summary = "Lấy danh sách hạng thành viên cố định",
        description = "Trả về bốn hạng thành viên được định nghĩa sẵn cùng điểm yêu cầu và mức ưu đãi."
    )
    public ResponseEntity<List<MembershipResponse>> getAllMembership() {
        return ResponseEntity.ok(
            membershipService.getAllMembership()
        );
    }
}
