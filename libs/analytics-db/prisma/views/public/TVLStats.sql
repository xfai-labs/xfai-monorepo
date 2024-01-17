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
    pm."timestamp"
  FROM
    periods p,
    LATERAL (
      SELECT
        bt."timestamp"
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
), ethbalances AS (
  SELECT
    b.period,
    pm."ethBalance"
  FROM
    (
      block b
      LEFT JOIN "PoolMetric" pm ON ((pm."timestamp" = b."timestamp"))
    )
)
SELECT
  (ethbalances.period) :: date AS date,
  round(
    (
      (
        (sum(ethbalances."ethBalance") * (2) :: numeric) * (
          SELECT
            "EthPrice"."usdPrice"
          FROM
            (
              "EthPrice"
              JOIN "BlockTimestamp" bt ON (("EthPrice"."blockNumber" = bt."blockNumber"))
            )
          WHERE
            (
              bt."timestamp" <= (ethbalances.period + '1 day' :: INTERVAL)
            )
          ORDER BY
            "EthPrice"."blockNumber" DESC
          LIMIT
            1
        )
      ) / power((10) :: numeric, ((8 + 16)) :: numeric)
    ), 2
  ) AS tvl
FROM
  ethbalances
GROUP BY
  ethbalances.period;