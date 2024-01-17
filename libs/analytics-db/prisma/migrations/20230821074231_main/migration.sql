-- CreateTable
CREATE TABLE "Pool" (
    "id" SERIAL NOT NULL,
    "tokenAddress" TEXT NOT NULL,
    "createdBlockNumber" BIGINT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL,
    "decimals" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "symbol" TEXT NOT NULL,

    CONSTRAINT "Pool_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PoolMetric" (
    "tokenAddress" TEXT NOT NULL,
    "blockNumber" BIGINT NOT NULL,
    "tokenBalance" DECIMAL(65,30) NOT NULL,
    "feesEarned" DECIMAL(65,30) NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL,
    "ethBalance" DECIMAL(65,30) NOT NULL,

    CONSTRAINT "PoolMetric_pkey" PRIMARY KEY ("tokenAddress","blockNumber")
);

-- CreateTable
CREATE TABLE "BlockTimestamp" (
    "blockNumber" BIGINT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BlockTimestamp_pkey" PRIMARY KEY ("blockNumber","timestamp")
);

-- CreateTable
CREATE TABLE "EthPrice" (
    "blockNumber" BIGINT NOT NULL,
    "usdPrice" DECIMAL(65,30) NOT NULL,
    "totalLocked" DECIMAL(65,30) NOT NULL,

    CONSTRAINT "EthPrice_pkey" PRIMARY KEY ("blockNumber")
);

-- CreateIndex
CREATE UNIQUE INDEX "Pool_tokenAddress_key" ON "Pool"("tokenAddress");

-- CreateIndex
CREATE INDEX "PoolMetric_timestamp_idx" ON "PoolMetric"("timestamp");
