SELECT 
    json_agg(user_data) AS "user"
FROM (
    SELECT
        json_build_object(
            'id',         u.id,
            'name',       u.name,
            'email',      u.email,
            'birthDate',  u."birthDate",
            'password',   u.password,
            'token',      u.token,
            'fcmToken',   u."fcmToken",
            'comorbidity', 
                json_agg(json_build_object(
                    'id',       c.id,
                    'name',     c.name,
                    'severity', c.severity
                )),
            'alert',
                json_agg(json_build_object(
                    'id',         a.id,
                    'locationId', a."locationId"
                )),
            'favorite',
                json_agg(json_build_object(
                    'id',         f.id,
                    'locationId', f."locationId"
                ))
        ) AS user_data
    FROM "user" u
    INNER JOIN user_comorbidity uc ON uc."userId" = u.id
    INNER JOIN comorbidity c       ON c.id = uc."comorbidityId"
    INNER JOIN alert a            ON a."userId" = u.id
    INNER JOIN favorite f         ON f."userId" = u.id
    WHERE u.id = 123
    GROUP BY u.id, u.name, u.email, u."birthDate", u.password, u.token, u."fcmToken"
) subquery
