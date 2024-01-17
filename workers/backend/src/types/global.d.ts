import '@total-typescript/ts-reset';
import { Xfai } from '@xfai-labs/sdk';

declare global {
  type RouteHandler = (
    xfai: Xfai,
    request: Request,
  ) => Promise<
    | {
        content: unknown;
        cacheTime?: number;
      }
    | undefined
  >;
}
