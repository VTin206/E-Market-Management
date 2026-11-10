-- Make the existing membership entity point to one of the fixed tiers.
ALTER TABLE membership
    ADD COLUMN tier VARCHAR(20);

INSERT INTO membership (name, discount_percent, required_points, tier)
VALUES
    ('Thành viên', 0, 0, 'MEMBER'),
    ('Bạc', 1, 500, 'SILVER'),
    ('Vàng', 2, 2000, 'GOLD'),
    ('Kim cương', 3, 5000, 'DIAMOND')
ON CONFLICT (name) DO UPDATE
SET discount_percent = EXCLUDED.discount_percent,
    required_points = EXCLUDED.required_points,
    tier = EXCLUDED.tier;

UPDATE users
SET membership_id = (
    SELECT membership.id
    FROM membership
    WHERE membership.tier = CASE
        WHEN COALESCE(users.points, 0) >= 5000 THEN 'DIAMOND'
        WHEN COALESCE(users.points, 0) >= 2000 THEN 'GOLD'
        WHEN COALESCE(users.points, 0) >= 500 THEN 'SILVER'
        ELSE 'MEMBER'
    END
);

DELETE FROM membership
WHERE tier IS NULL;

ALTER TABLE membership
    ALTER COLUMN tier SET NOT NULL,
    DROP COLUMN name,
    DROP COLUMN discount_percent,
    DROP COLUMN required_points,
    ADD CONSTRAINT chk_membership_tier_value
        CHECK (tier IN ('MEMBER', 'SILVER', 'GOLD', 'DIAMOND'));

CREATE UNIQUE INDEX IF NOT EXISTS uk_membership_tier ON membership (tier);

ALTER TABLE users
    ALTER COLUMN membership_id SET NOT NULL;
