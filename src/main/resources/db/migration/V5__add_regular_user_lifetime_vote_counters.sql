ALTER TABLE regular_users
    ADD COLUMN total_likes_received INT NOT NULL DEFAULT 0,
    ADD COLUMN total_dislikes_received INT NOT NULL DEFAULT 0;

UPDATE regular_users ru
LEFT JOIN (
    SELECT a.user_id,
           COALESCE(SUM(a.upvotes), 0) AS likes_sum,
           COALESCE(SUM(a.downvotes), 0) AS dislikes_sum
    FROM answers a
    GROUP BY a.user_id
) agg ON agg.user_id = ru.id
SET ru.total_likes_received = COALESCE(agg.likes_sum, 0),
    ru.total_dislikes_received = COALESCE(agg.dislikes_sum, 0);
