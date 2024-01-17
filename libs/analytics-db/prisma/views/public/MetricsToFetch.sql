SELECT
  p."tokenAddress",
  bt."blockNumber",
  bt."timestamp"
FROM
  (
    (
      "Pool" p
      JOIN "BlockTimestamp" bt ON ((bt."blockNumber" > p."createdBlockNumber"))
    )
    LEFT JOIN "PoolMetric" pm ON (
      (
        (bt."blockNumber" = pm."blockNumber")
        AND (pm."tokenAddress" = p."tokenAddress")
      )
    )
  )
WHERE
  (pm."blockNumber" IS NULL)
ORDER BY
  bt."blockNumber" DESC;