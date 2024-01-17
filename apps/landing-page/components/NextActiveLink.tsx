import Link, { LinkProps } from 'next/link';
import { useRouter } from 'next/router';
import { AnchorHTMLAttributes, ReactNode, RefAttributes, FunctionComponent } from 'react';

type Props = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof LinkProps> &
  LinkProps & {
    children?: ReactNode;
  } & RefAttributes<HTMLAnchorElement>;

const NextActiveLink: FunctionComponent<Props> = ({ children, ...props }) => {
  const { asPath } = useRouter();
  const defaultClassName = props.className ? props.className : undefined;

  const className =
    asPath === props.href || asPath === props.as
      ? `${defaultClassName} ${'active'}`.trim()
      : defaultClassName;

  return (
    <Link {...props} className={className} onClick={props.onClick}>
      {children}
    </Link>
  );
};

export default NextActiveLink;
