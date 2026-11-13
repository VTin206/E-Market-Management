package E_Market_Management.order.entity;

public enum STATUS {
    PENDING,
    CONFIRMED,
    PROCESSING,
    SHIPPED,
    DELIVERED,
    COMPLETED,
    CANCELLED;

    public boolean canTransitionTo(STATUS nextStatus) {
        if (nextStatus == null) return false;
        if (this == nextStatus) return true;

        return switch (this) {
            case PENDING -> nextStatus == CONFIRMED || nextStatus == PROCESSING || nextStatus == CANCELLED;
            case CONFIRMED -> nextStatus == PROCESSING || nextStatus == CANCELLED;
            case PROCESSING -> nextStatus == SHIPPED || nextStatus == CANCELLED;
            case SHIPPED -> nextStatus == DELIVERED;
            case DELIVERED -> nextStatus == COMPLETED;
            case COMPLETED, CANCELLED -> false;
        };
    }
}
