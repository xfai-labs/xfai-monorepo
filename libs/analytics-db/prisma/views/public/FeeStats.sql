WITH periods AS (
  SELECT
    generate_series(
      (
        (
          ((NOW()) :: date) :: timestamp without time zone + '1 day' :: INTERVAL
        )
      ) :: timestamp WITH time zone,
      (
        (
          SELECT
            min("BlockTimestamp"."timestamp") AS min
          FROM
            "BlockTimestamp"
        )
      ) :: timestamp WITH time zone,
      '-1 days' :: INTERVAL
    ) AS period
),
maxblock AS MATERIALIZED (
  SELECT
    b."blockNumber"
  FROM
    (
      SELECT
        "PoolMetric"."blockNumber",
        count(*) AS count
      FROM
        "PoolMetric"
      GROUP BY
        "PoolMetric"."blockNumber"
      ORDER BY
        "PoolMetric"."blockNumber" DESC
      LIMIT
        2
    ) b
  ORDER BY
    b.count DESC
  LIMIT
    1
), block AS (
  SELECT
    p.period,
    pm."timestamp",
    pm."blockNumber"
  FROM
    periods p,
    LATERAL (
      SELECT
        bt."timestamp",
        bt."blockNumber"
      FROM
        "BlockTimestamp" bt
      WHERE
        (
          (bt."timestamp" <= p.period)
          AND (
            bt."blockNumber" <= (
              SELECT
                maxblock."blockNumber"
              FROM
                maxblock
              LIMIT
                1
            )
          )
        )
      ORDER BY
        bt."timestamp" DESC
      LIMIT
        1
    ) pm
), "ethBalances" AS (
  SELECT
    p.period,
    pools."tokenAddress",
    (
      SELECT
        pm."feesEarned"
      FROM
        "PoolMetric" pm
      WHERE
        (
          (pm."blockNumber" = p."blockNumber")
          AND (pools."tokenAddress" = pm."tokenAddress")
        )
      LIMIT
        1
    ) AS "feesEarned",
    (
      SELECT
        (lpm."ethBalance" / lpm."tokenBalance")
      FROM
        "PoolMetric" lpm
      WHERE
        (lpm."tokenAddress" = pools."tokenAddress")
      ORDER BY
        lpm."blockNumber" DESC
      LIMIT
        1
    ) AS "xfRatio",
    (
      SELECT
        lpm."ethBalance"
      FROM
        "PoolMetric" lpm
      WHERE
        (lpm."tokenAddress" = pools."tokenAddress")
      ORDER BY
        lpm."blockNumber" DESC
      LIMIT
        1
    ) AS "ethBalance",
    p."blockNumber"
  FROM
    block p,
    "Pool" pools
),
cummulatives AS (
  SELECT
    ("ethBalances".period) :: date AS date,
    sum(
      (
        "ethBalances"."feesEarned" * "ethBalances"."xfRatio"
      )
    ) AS fees,
    max("ethBalances"."blockNumber") AS "blockNumber"
  FROM
    "ethBalances"
  WHERE
    (
      ("ethBalances"."ethBalance") :: double precision > (
        (0.01) :: double precision * pow((10) :: double precision, (18) :: double precision)
      )
    )
  GROUP BY
    "ethBalances".period
)
SELECT
  ((cummulatives.date - '1 day' :: INTERVAL)) :: date AS date,
  round(
    (
      (
        (
          (2) :: numeric * (
            cummulatives.fees - COALESCE(
              lag(cummulatives.fees, 1) OVER (
                ORDER BY
                  cummulatives.date
              ),
              (0) :: numeric
            )
          )
        ) * (
          SELECT
            "EthPrice"."usdPrice"
          FROM
            "EthPrice"
          WHERE
            (
              "EthPrice"."blockNumber" = cummulatives."blockNumber"
            )
          LIMIT
            1
        )
      ) / pow((10) :: numeric, ((6 + 18)) :: numeric)
    ), 2
  ) AS fees
FROM
  cummulatives
ORDER BY
  cummulatives.date;