export const BackendConfig = () =>
  ({
    server: {
      port: parseInt(process.env.PORT ?? '3000', 10) || 3000,
      globalPrefix: process.env.API_GLOBAL_PREFIX || 'api',
    },
    redis: {
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT ?? '6379', 10) || 6379,
      db: parseInt(process.env.REDIS_DB ?? '0', 10) || 0,
    },
  }) as const;

export type BackendConfig = ReturnType<typeof BackendConfig>;
