import React from 'react';
import cs from 'classnames';

type Props = {
  title: string;
  description?: string;
} & React.HTMLAttributes<HTMLDivElement>;

export default function SectionTitle({ title, description, className, ...props }: Props) {
  return (
    <>
      <div className={cs('flex flex-col gap-2.5', className)} {...props}>
        <h2 className="text-white-blue text-[1.75rem] uppercase !leading-tight">{title}</h2>
        {description && <p>{description}</p>}
      </div>
    </>
  );
}
