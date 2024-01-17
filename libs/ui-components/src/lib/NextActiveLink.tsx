import type { LinkProps } from 'next/link';
import { AnchorHTMLAttributes, ReactNode, RefAttributes, FunctionComponent } from 'react';

type Props = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof LinkProps> &
  LinkProps & {
    children?: ReactNode;
  } & RefAttributes<HTMLAnchorElement>;
type NextActiveLink = FunctionComponent<Props>;

export default NextActiveLink;
