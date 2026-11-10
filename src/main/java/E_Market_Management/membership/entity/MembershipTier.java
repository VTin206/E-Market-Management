package E_Market_Management.membership.entity;

public enum MembershipTier {
    MEMBER("Thành viên", 0, 0),
    SILVER("Bạc", 1, 500),
    GOLD("Vàng", 2, 2_000),
    DIAMOND("Kim cương", 3, 5_000);

    private final String name;
    private final Integer discountPercent;
    private final Integer requiredPoints;

    MembershipTier(String name, Integer discountPercent, Integer requiredPoints) {
        this.name = name;
        this.discountPercent = discountPercent;
        this.requiredPoints = requiredPoints;
    }

    public String getName() {
        return name;
    }

    public Integer getDiscountPercent() {
        return discountPercent;
    }

    public Integer getRequiredPoints() {
        return requiredPoints;
    }
}
