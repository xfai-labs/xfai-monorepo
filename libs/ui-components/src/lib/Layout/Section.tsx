import { FunctionComponent, HTMLProps } from 'react';
import cs from 'classnames';

const Section: FunctionComponent<HTMLProps<HTMLDivElement>> = ({
  className,
  children,
  ...props
}) => {
  return (
    <div
      className={cs('flex w-full flex-col gap-5 md:gap-6 lg:gap-7 xl:gap-8', className)}
      {...props}
    >
      {children}
    </div>
  );
};

export default Section;
