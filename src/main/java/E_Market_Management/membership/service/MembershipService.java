package E_Market_Management.membership.service;

import java.util.List;

import org.springframework.stereotype.Service;

import E_Market_Management.Exception.ConflictException;
import E_Market_Management.membership.dto.MembershipCreateRequest;
import E_Market_Management.membership.dto.MembershipResponse;
import E_Market_Management.membership.entity.Membership;
import E_Market_Management.membership.mapper.MembershipMapper;
import E_Market_Management.membership.repository.MembershipRepository;

@Service 
public class MembershipService {
    private final MembershipRepository membershipRepository;
    private final MembershipMapper membershipMapper;

    public MembershipService(
        MembershipRepository membershipRepository,
        MembershipMapper membershipMapper
    ) {
        this.membershipRepository = membershipRepository;
        this.membershipMapper = membershipMapper;
    }

    public MembershipResponse createMembership(MembershipCreateRequest request) {
        Membership check = membershipRepository.findByName(request.getName())
            .orElseThrow(() -> new ConflictException("Đã tồn tại hạng thành viên này!"))

        Membership membership = Membership.builder()
            .name(request.getName())
            .discountPercent(request.getDiscountPercent())
            .requiredPoints(request.getRequiredPoints())
            .build();

        return membershipMapper.toResponse(membershipRepository.save(membership));
    }

    public List<MembershipResponse> getAllMembership() {
        List<Membership> memberships = membershipRepository.findAll();
        return memberships.stream()
            .map(membership -> membershipMapper.toResponse(membership))
            .toList();
    }

}
