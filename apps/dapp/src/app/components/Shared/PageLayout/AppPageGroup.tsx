import { HTMLAttributes, FunctionComponent } from 'react';
import cs from 'classnames';

const AppPageGroup: FunctionComponent<HTMLAttributes<HTMLDivElement>> = ({
  className,
  children,
}) => {
  return (
    <div
      className={cs(
        'flex w-full max-w-sm flex-col items-center gap-2.5 lg:max-w-[26rem] lg:gap-4 2xl:max-w-[29rem] [&>*]:w-full',
        className,
      )}
    >
      {children}
    </div>
  );
};
export default AppPageGroup;
