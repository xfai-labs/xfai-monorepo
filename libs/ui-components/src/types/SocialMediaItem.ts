import { FC, HTMLAttributes } from 'react';

export default interface NavigationItem {
  label: string;
  icon: FC<HTMLAttributes<unknown>>;
  link: string;
}
