package E_Market_Management.membership.entity;

import java.util.List;

import jakarta.persistence.*;
import lombok.*;

import E_Market_Management.user.entity.User;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "membership")
public class Membership {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 100)
    private String name;

    @Column(nullable = false)
    private Integer discountPercent;

    @Column(nullable = false)
    private Integer requiredPoints;

    @OneToMany(mappedBy = "membership")
    private List<User> users;
}
