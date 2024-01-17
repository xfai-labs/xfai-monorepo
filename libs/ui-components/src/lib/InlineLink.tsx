import cs from 'classnames';
import { IconArrowRight } from './assets/icons';
import { FunctionComponent, HTMLProps } from 'react';

type Props = {
  disabled?: boolean;
} & HTMLProps<HTMLAnchorElement>;

const InlineLink: FunctionComponent<Props> = ({
  className,
  children,
  disabled,
  href,
  ...props
}) => {
  return (
    <a
      className={cs(
        'group/link relative inline-block transition-colors after:absolute after:bottom-0 after:block after:h-px after:w-0 after:transition-[width] after:content-[""] hover:after:w-full',
        disabled || !href
          ? 'text-20 after:bg-20 fill-20 pointer-events-none'
          : 'text-cyan after:bg-cyan-dark fill-cyan',
        className,
      )}
      href={href}
      {...props}
    >
      {children}{' '}
      <IconArrowRight className="inline-block h-3 w-3 transition-transform group-hover/link:translate-x-0.5" />
    </a>
  );
};

export default InlineLink;
