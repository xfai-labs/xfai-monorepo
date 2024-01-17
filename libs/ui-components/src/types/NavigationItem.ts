import { FC, HTMLAttributes } from 'react';

export default interface NavigationItem {
  label: string;
  path: string;
  icon?: FC<HTMLAttributes<any>>;
  external?: boolean;
}
