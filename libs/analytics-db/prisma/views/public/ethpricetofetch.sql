SELECT
  bt."blockNumber",
  bt."timestamp"
FROM
  (
    "BlockTimestamp" bt
    LEFT JOIN "EthPrice" xfp ON ((bt."blockNumber" = xfp."blockNumber"))
  )
WHERE
  (xfp."usdPrice" IS NULL);