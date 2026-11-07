package E_Market_Management.order.entity;

public enum STATUS {
    PENDING,
    PROCESSING,
    COMPLETED,
    CANCELLED;

    public boolean canTransitionTo(STATUS nextStatus) {
        if (nextStatus == null) return false;
        if (this == nextStatus) return true;

        return switch (this) {
            case PENDING -> nextStatus == PROCESSING || nextStatus == CANCELLED;
            case PROCESSING -> nextStatus == COMPLETED || nextStatus == CANCELLED;
            case COMPLETED, CANCELLED -> false;
        };
    }
}
