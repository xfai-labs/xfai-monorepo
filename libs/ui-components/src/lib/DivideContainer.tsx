import cs from 'classnames';
import { FunctionComponent, HTMLProps } from 'react';

const DivideContainer: FunctionComponent<HTMLProps<HTMLDivElement>> = ({ className, children }) => {
  return (
    <div className={cs('relative flex justify-center', className)}>
      <hr className="bg-60 absolute top-1/2 z-0 m-0 block h-px w-full border-none p-0" />
      <div className="z-10">{children}</div>
    </div>
  );
};

export default DivideContainer;
