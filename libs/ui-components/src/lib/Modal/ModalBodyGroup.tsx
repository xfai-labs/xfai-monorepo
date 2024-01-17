import { HTMLAttributes } from 'react';
import cs from 'classnames';

type Props = {
  title?: string;
  required?: boolean;
} & HTMLAttributes<HTMLDivElement>;

export default function ModalBodyGroup({ title, required, className, children, ...props }: Props) {
  return (
    <div className={cs('flex flex-col gap-2', className)} {...props}>
      {title && (
        <h6 className="text-white-blue text-sm font-medium">
          {title}
          {required && <span className="text-magenta"> *</span>}
        </h6>
      )}
      {children}
    </div>
  );
}
