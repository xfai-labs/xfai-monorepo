WITH latest AS (
  SELECT
    "PoolMetric"."tokenAddress",
    max("PoolMetric"."blockNumber") AS "blockNumber",
    max("PoolMetric"."timestamp") AS "timestamp"
  FROM
    "PoolMetric"
  GROUP BY
    "PoolMetric"."tokenAddress"
),
"yesterdayBlocks" AS (
  SELECT
    tm."tokenAddress",
    max(tm."blockNumber") AS "blockNumber"
  FROM
    "PoolMetric" tm
  WHERE
    (
      EXISTS (
        SELECT
          latest."tokenAddress",
          latest."blockNumber"
        FROM
          latest
        WHERE
          (
            (1 = 1)
            AND (tm."tokenAddress" = latest."tokenAddress")
            AND (
              tm."timestamp" <= (latest."timestamp" - '1 day' :: INTERVAL)
            )
          )
      )
    )
  GROUP BY
    tm."tokenAddress"
),
"lastWeekBlocks" AS (
  SELECT
    tm."tokenAddress",
    max(tm."blockNumber") AS "blockNumber"
  FROM
    "PoolMetric" tm
  WHERE
    (
      EXISTS (
        SELECT
          latest."tokenAddress",
          latest."blockNumber"
        FROM
          latest
        WHERE
          (
            (1 = 1)
            AND (tm."tokenAddress" = latest."tokenAddress")
            AND (
              tm."timestamp" <= (latest."timestamp" - '7 days' :: INTERVAL)
            )
          )
      )
    )
  GROUP BY
    tm."tokenAddress"
),
"oldestBlocks" AS (
  SELECT
    tm."tokenAddress",
    min(tm."blockNumber") AS "blockNumber"
  FROM
    "PoolMetric" tm
  WHERE
    (
      EXISTS (
        SELECT
          latest."tokenAddress",
          latest."blockNumber"
        FROM
          latest
        WHERE
          (
            (1 = 1)
            AND (tm."tokenAddress" = latest."tokenAddress")
          )
      )
    )
  GROUP BY
    tm."tokenAddress"
),
"latestMetrics" AS (
  SELECT
    tm."tokenAddress",
    tm."blockNumber",
    tm."ethBalance",
    tm."tokenBalance",
    tm."feesEarned",
    tm."timestamp"
  FROM
    "PoolMetric" tm
  WHERE
    (
      EXISTS (
        SELECT
          latest."tokenAddress",
          latest."blockNumber"
        FROM
          latest
        WHERE
          (
            (1 = 1)
            AND (tm."tokenAddress" = latest."tokenAddress")
            AND (tm."blockNumber" = latest."blockNumber")
          )
      )
    )
),
"yesterdayMetrics" AS (
  SELECT
    tm."tokenAddress",
    tm."blockNumber",
    tm."ethBalance",
    tm."tokenBalance",
    tm."feesEarned",
    tm."timestamp"
  FROM
    "PoolMetric" tm
  WHERE
    (
      EXISTS (
        SELECT
          "yesterdayBlocks"."tokenAddress",
          "yesterdayBlocks"."blockNumber"
        FROM
          "yesterdayBlocks"
        WHERE
          (
            (1 = 1)
            AND (
              tm."tokenAddress" = "yesterdayBlocks"."tokenAddress"
            )
            AND (
              tm."blockNumber" = "yesterdayBlocks"."blockNumber"
            )
          )
      )
    )
),
"weeklyMetrics" AS (
  SELECT
    tm."tokenAddress",
    tm."blockNumber",
    tm."ethBalance",
    tm."tokenBalance",
    tm."feesEarned",
    tm."timestamp"
  FROM
    "PoolMetric" tm
  WHERE
    (
      EXISTS (
        SELECT
          "lastWeekBlocks"."tokenAddress",
          "lastWeekBlocks"."blockNumber"
        FROM
          "lastWeekBlocks"
        WHERE
          (
            (1 = 1)
            AND (
              tm."tokenAddress" = "lastWeekBlocks"."tokenAddress"
            )
            AND (
              tm."blockNumber" = "lastWeekBlocks"."blockNumber"
            )
          )
      )
    )
),
"allTimeMetrics" AS (
  SELECT
    tm."tokenAddress",
    tm."blockNumber",
    tm."ethBalance",
    tm."tokenBalance",
    tm."feesEarned",
    tm."timestamp"
  FROM
    "PoolMetric" tm
  WHERE
    (
      EXISTS (
        SELECT
          "oldestBlocks"."tokenAddress",
          "oldestBlocks"."blockNumber"
        FROM
          "oldestBlocks"
        WHERE
          (
            (1 = 1)
            AND (
              tm."tokenAddress" = "oldestBlocks"."tokenAddress"
            )
            AND (tm."blockNumber" = "oldestBlocks"."blockNumber")
          )
      )
    )
),
"baseMetrics" AS (
  SELECT
    l."tokenAddress",
    l."blockNumber",
    l."ethBalance",
    l."tokenBalance",
    COALESCE(y."blockNumber", o."blockNumber") AS "dayold_blockNumber",
    COALESCE(y."tokenBalance", o."tokenBalance") AS "dayold_tokenBalance",
    COALESCE(y."ethBalance", o."tokenBalance") AS "dayold_ethBalance",
    COALESCE(w."blockNumber", o."blockNumber") AS "weekold_blockNumber",
    COALESCE(w."tokenBalance", o."tokenBalance") AS "weekold_tokenBalance",
    COALESCE(w."ethBalance", o."tokenBalance") AS "weekold_ethBalance",
    o."blockNumber" AS "oldest_blockNumber",
    o."tokenBalance" AS "oldest_tokenBalance",
    o."ethBalance" AS "oldest_ethBalance",
    l."feesEarned",
    l."timestamp",
    (
      l."feesEarned" - COALESCE(y."feesEarned", o."feesEarned")
    ) AS daily_fees,
    (
      l."feesEarned" - COALESCE(w."feesEarned", o."feesEarned")
    ) AS weekly_fees
  FROM
    (
      (
        (
          "latestMetrics" l
          LEFT JOIN "yesterdayMetrics" y ON ((l."tokenAddress" = y."tokenAddress"))
        )
        LEFT JOIN "weeklyMetrics" w ON ((l."tokenAddress" = w."tokenAddress"))
      )
      LEFT JOIN "allTimeMetrics" o ON ((l."tokenAddress" = o."tokenAddress"))
    )
),
"normalizedMetrics" AS (
  SELECT
    "baseMetrics"."tokenAddress",
    "baseMetrics"."ethBalance",
    "baseMetrics"."dayold_ethBalance",
    "baseMetrics"."dayold_tokenBalance",
    "baseMetrics"."weekold_ethBalance",
    "baseMetrics"."weekold_tokenBalance",
    "baseMetrics"."oldest_ethBalance",
    "baseMetrics"."oldest_tokenBalance",
    "baseMetrics"."tokenBalance",
    "baseMetrics"."feesEarned",
    "baseMetrics"."timestamp",
    "baseMetrics".daily_fees,
    "baseMetrics".weekly_fees,
    (
      SELECT
        xf."blockNumber"
      FROM
        "EthPrice" xf
      WHERE
        (xf."blockNumber" <= "baseMetrics"."blockNumber")
      ORDER BY
        xf."blockNumber" DESC
      LIMIT
        1
    ) AS "blockNumber",
    (
      SELECT
        xf."blockNumber"
      FROM
        "EthPrice" xf
      WHERE
        (
          xf."blockNumber" <= "baseMetrics"."dayold_blockNumber"
        )
      ORDER BY
        xf."blockNumber" DESC
      LIMIT
        1
    ) AS "dayold_blockNumber",
    (
      SELECT
        xf."blockNumber"
      FROM
        "EthPrice" xf
      WHERE
        (
          xf."blockNumber" <= "baseMetrics"."weekold_blockNumber"
        )
      ORDER BY
        xf."blockNumber" DESC
      LIMIT
        1
    ) AS "weekold_blockNumber",
    (
      SELECT
        xf."blockNumber"
      FROM
        "EthPrice" xf
      WHERE
        (
          xf."blockNumber" <= "baseMetrics"."oldest_blockNumber"
        )
      ORDER BY
        xf."blockNumber" DESC
      LIMIT
        1
    ) AS "oldest_blockNumber"
  FROM
    "baseMetrics"
),
"usdMetrics" AS (
  SELECT
    nm."tokenAddress",
    p.name,
    p.symbol,
    round(
      (
        ((nm."ethBalance" * t."usdPrice") * (2) :: numeric) / (concat('1', repeat('0' :: text, (18 + 6)))) :: numeric
      ),
      2
    ) AS tvl,
    calculate_adjusted_price(
      (p.id) :: bigint,
      p.decimals,
      t."usdPrice",
      nm."ethBalance",
      nm."tokenBalance",
      nm."feesEarned"
    ) AS "feesEarned",
    calculate_adjusted_price(
      (p.id) :: bigint,
      p.decimals,
      t."usdPrice",
      nm."ethBalance",
      nm."tokenBalance",
      nm.daily_fees
    ) AS daily_fees,
    calculate_adjusted_price(
      (p.id) :: bigint,
      p.decimals,
      t."usdPrice",
      nm."ethBalance",
      nm."tokenBalance",
      nm.weekly_fees
    ) AS weekly_fees,
    calculate_adjusted_price(
      (p.id) :: bigint,
      p.decimals,
      t."usdPrice",
      nm."ethBalance",
      nm."tokenBalance"
    ) AS price,
    calculate_adjusted_price(
      (p.id) :: bigint,
      p.decimals,
      d."usdPrice",
      nm."dayold_ethBalance",
      nm."dayold_tokenBalance"
    ) AS dayold_price,
    calculate_adjusted_price(
      (p.id) :: bigint,
      p.decimals,
      w."usdPrice",
      nm."weekold_ethBalance",
      nm."weekold_tokenBalance"
    ) AS weekold_price,
    calculate_adjusted_price(
      (p.id) :: bigint,
      p.decimals,
      o."usdPrice",
      nm."oldest_ethBalance",
      nm."oldest_tokenBalance"
    ) AS oldest_price
  FROM
    (
      (
        (
          (
            (
              "normalizedMetrics" nm
              JOIN "EthPrice" t ON ((t."blockNumber" = nm."blockNumber"))
            )
            LEFT JOIN "EthPrice" d ON ((d."blockNumber" = nm."dayold_blockNumber"))
          )
          LEFT JOIN "EthPrice" w ON ((w."blockNumber" = nm."weekold_blockNumber"))
        )
        LEFT JOIN "EthPrice" o ON ((o."blockNumber" = nm."oldest_blockNumber"))
      )
      JOIN "Pool" p ON ((p."tokenAddress" = nm."tokenAddress"))
    )
),
final AS (
  SELECT
    "usdMetrics"."tokenAddress",
    "usdMetrics".name,
    "usdMetrics".symbol,
    "usdMetrics".tvl,
    CASE
      WHEN ("usdMetrics".price = (0) :: numeric) THEN 0.000000000001
      ELSE "usdMetrics".price
    END AS price,
    "usdMetrics".oldest_price,
    round(("usdMetrics"."feesEarned" * (1000) :: numeric), 2) AS volume,
    round(("usdMetrics"."feesEarned" * (2) :: numeric), 2) AS fees,
    "usdMetrics".weekold_price,
    round(("usdMetrics".weekly_fees * (1000) :: numeric), 2) AS weekly_volume,
    round(("usdMetrics".weekly_fees * (2) :: numeric), 2) AS weekly_fees,
    "usdMetrics".dayold_price,
    round(("usdMetrics".daily_fees * (1000) :: numeric), 2) AS daily_volume,
    round(("usdMetrics".daily_fees * (2) :: numeric), 2) AS daily_fees
  FROM
    "usdMetrics"
)
SELECT
  final."tokenAddress",
  final.name,
  final.symbol,
  CASE
    WHEN (
      final."tokenAddress" = '0xe5D7C2a44FfDDf6b295A15c148167daaAf5Cf34f' :: text
    ) THEN (
      SELECT
        round(sum((t.tvl / (2) :: numeric)), 2) AS round
      FROM
        final t
      LIMIT
        1
    )
    ELSE final.tvl
  END AS tvl,
  final.price,
  final.oldest_price,
  final.volume,
  final.fees,
  final.weekold_price,
  final.weekly_volume,
  final.weekly_fees,
  final.dayold_price,
  final.daily_volume,
  final.daily_fees,
  COALESCE(
    round(
      (
        (
          (final.price - final.dayold_price) * (100) :: numeric
        ) / final.price
      ),
      2
    ),
    (0) :: numeric
  ) AS daily_price_change,
  COALESCE(
    round(
      (
        (
          (final.price - final.weekold_price) * (100) :: numeric
        ) / final.price
      ),
      2
    ),
    (0) :: numeric
  ) AS weekly_price_change,
  COALESCE(
    round(
      (
        (
          (final.price - final.oldest_price) * (100) :: numeric
        ) / final.price
      ),
      2
    ),
    (0) :: numeric
  ) AS price_change
FROM
  final;