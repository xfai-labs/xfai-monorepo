import cs from 'classnames';
import { IconArrowRight } from './assets/icons';
import { HTMLProps, FunctionComponent } from 'react';

const VisualLink: FunctionComponent<HTMLProps<HTMLParagraphElement>> = ({
  className,
  children,
  ...props
}) => {
  return (
    <p
      className={cs(
        'group/link text-cyan after:bg-cyan fill-cyan relative inline-block transition-colors after:absolute after:bottom-0 after:block after:h-px after:w-0 after:transition-[width] after:content-[""] hover:after:w-full',
        className,
      )}
      {...props}
    >
      {children}{' '}
      <IconArrowRight className="inline-block h-3 w-3 transition-transform group-hover/link:translate-x-0.5" />
    </p>
  );
};

export default VisualLink;
