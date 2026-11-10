package E_Market_Management.membership.entity;

import java.util.List;

import E_Market_Management.user.entity.User;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor
@Table(name = "membership")
public class Membership {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, unique = true, length = 20)
    private MembershipTier tier;

    @OneToMany(mappedBy = "membership")
    private List<User> users;

    public String getName() {
        return tier.getName();
    }

    public Integer getDiscountPercent() {
        return tier.getDiscountPercent();
    }

    public Integer getRequiredPoints() {
        return tier.getRequiredPoints();
    }
}
