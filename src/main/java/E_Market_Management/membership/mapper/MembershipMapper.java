package E_Market_Management.membership.mapper;

import E_Market_Management.membership.dto.MembershipResponse;
import E_Market_Management.membership.entity.Membership;

public class MembershipMapper {
    public MembershipResponse toResponse (Membership membership) {
        MembershipResponse response = MembershipResponse.builder()
            .id(membership.getId())
            .name(membership.getName())
            .discountPercent(membership.getDiscountPercent())
            .requiredPoints(membership.getRequiredPoints())
            .build();
        return response;
    }
}
