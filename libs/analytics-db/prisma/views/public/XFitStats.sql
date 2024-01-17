WITH accumulated AS (
  SELECT
    (
      SELECT
        (
          xep."totalLocked" / (concat('1', repeat('0' :: text, 18))) :: numeric
        )
      FROM
        (
          "BlockTimestamp"
          JOIN "EthPrice" xep ON (
            (
              "BlockTimestamp"."blockNumber" = xep."blockNumber"
            )
          )
        )
      ORDER BY
        "BlockTimestamp"."blockNumber" DESC
      LIMIT
        1
    ) AS latest,
    (
      SELECT
        (
          xep."totalLocked" / (concat('1', repeat('0' :: text, 18))) :: numeric
        )
      FROM
        (
          "BlockTimestamp"
          JOIN "EthPrice" xep ON (
            (
              "BlockTimestamp"."blockNumber" = xep."blockNumber"
            )
          )
        )
      WHERE
        (
          "BlockTimestamp"."timestamp" < (NOW() - '1 day' :: INTERVAL)
        )
      ORDER BY
        "BlockTimestamp"."blockNumber" DESC
      LIMIT
        1
    ) AS dayold,
    (
      SELECT
        (
          xep."totalLocked" / (concat('1', repeat('0' :: text, 18))) :: numeric
        )
      FROM
        (
          "BlockTimestamp"
          JOIN "EthPrice" xep ON (
            (
              "BlockTimestamp"."blockNumber" = xep."blockNumber"
            )
          )
        )
      WHERE
        (
          "BlockTimestamp"."timestamp" < (NOW() - '7 days' :: INTERVAL)
        )
      ORDER BY
        "BlockTimestamp"."blockNumber" DESC
      LIMIT
        1
    ) AS weeklold
)
SELECT
  round(accumulated.latest) AS current,
  COALESCE(
    round((accumulated.latest - accumulated.dayold)),
    (0) :: numeric
  ) AS daily_change,
  COALESCE(
    round((accumulated.latest - accumulated.weeklold)),
    (0) :: numeric
  ) AS weekly_change,
  (
    SELECT
      "PoolAnalytic".price
    FROM
      "PoolAnalytic"
    WHERE
      (
        "PoolAnalytic"."tokenAddress" = '0x8C56017B172226fE024dEa197748FC1eaccC82B1' :: text
      )
    LIMIT
      1
  ) AS price
FROM
  accumulated;