package E_Market_Management.membership.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.when;

import java.util.List;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import E_Market_Management.membership.dto.MembershipResponse;
import E_Market_Management.membership.entity.Membership;
import E_Market_Management.membership.entity.MembershipTier;
import E_Market_Management.membership.mapper.MembershipMapper;
import E_Market_Management.membership.repository.MembershipRepository;

@ExtendWith(MockitoExtension.class)
class MembershipServiceTest {

    @Mock
    private MembershipRepository membershipRepository;

    @Mock
    private MembershipMapper membershipMapper;

    @InjectMocks
    private MembershipService membershipService;

    @Test
    void getAllMembership_sortsByRequiredPointsAscending() {
        Membership gold = membership(MembershipTier.GOLD);
        Membership member = membership(MembershipTier.MEMBER);
        Membership silver = membership(MembershipTier.SILVER);
        when(membershipRepository.findAll()).thenReturn(List.of(gold, member, silver));
        when(membershipMapper.toResponse(member)).thenReturn(response(MembershipTier.MEMBER));
        when(membershipMapper.toResponse(silver)).thenReturn(response(MembershipTier.SILVER));
        when(membershipMapper.toResponse(gold)).thenReturn(response(MembershipTier.GOLD));

        List<MembershipResponse> actual = membershipService.getAllMembership();

        assertEquals(List.of(0, 500, 2_000),
            actual.stream().map(MembershipResponse::getRequiredPoints).toList());
    }

    private Membership membership(MembershipTier tier) {
        Membership membership = org.mockito.Mockito.mock(Membership.class);
        when(membership.getTier()).thenReturn(tier);
        return membership;
    }

    private MembershipResponse response(MembershipTier tier) {
        return MembershipResponse.builder()
            .name(tier.getName())
            .requiredPoints(tier.getRequiredPoints())
            .build();
    }
}
