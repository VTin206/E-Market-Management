package E_Market_Management.membership.service;

import java.util.Comparator;
import java.util.List;

import org.springframework.stereotype.Service;

import E_Market_Management.membership.dto.MembershipResponse;
import E_Market_Management.membership.entity.Membership;
import E_Market_Management.membership.mapper.MembershipMapper;
import E_Market_Management.membership.repository.MembershipRepository;

@Service 
public class MembershipService {
    private final MembershipRepository membershipRepository;
    private final MembershipMapper membershipMapper;

    public MembershipService(MembershipRepository membershipRepository, MembershipMapper membershipMapper) {
        this.membershipRepository = membershipRepository;
        this.membershipMapper = membershipMapper;
    }

    public List<MembershipResponse> getAllMembership() {
        return membershipRepository.findAll().stream()
            .sorted(Comparator.comparing(membership -> membership.getTier().getRequiredPoints()))
            .map(membership -> membershipMapper.toResponse(membership))
            .toList();
    }

}
