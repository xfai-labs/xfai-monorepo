import { IXfaiFactory__factory } from '@xfai-labs/dex';
import { Xfai } from './xfai';

export const getFactory = (xfai: Xfai) =>
  IXfaiFactory__factory.connect(xfai.factoryAddress, xfai.provider);
