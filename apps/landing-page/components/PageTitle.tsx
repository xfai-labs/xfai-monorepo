import React from 'react';
import cs from 'classnames';

type Props = {
  title: string;
  description: string;
} & React.HTMLAttributes<HTMLDivElement>;

export default function PageTitle({ title, description, className, ...props }: Props) {
  return (
    <>
      <div className={cs('flex flex-col gap-2.5 ', className)} {...props}>
        <h1 className="text-white-blue text-3xl uppercase !leading-tight md:text-[2rem] xl:text-4xl">
          {title}
        </h1>
        <p className="text-magenta text-xl font-light md:text-2xl 2xl:text-2xl">{description}</p>
      </div>
    </>
  );
}
