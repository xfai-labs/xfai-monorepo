import { FunctionComponent, HTMLAttributes } from 'react';
import cs from 'classnames';

type Props = {
  title: string;
} & HTMLAttributes<HTMLDivElement>;

const ConfirmationModalBody: FunctionComponent<Props> = ({
  title,
  children,
  className,
  ...props
}) => {
  return (
    <div className={cs('flex flex-col gap-3 lg:gap-4', className)} {...props}>
      <h3 className="self-stretch text-center text-lg lg:text-xl 2xl:text-2xl">{title}</h3>
      {children && (
        <>
          <hr className="border-50 m-0" />
          {children}
        </>
      )}
    </div>
  );
};

export default ConfirmationModalBody;
