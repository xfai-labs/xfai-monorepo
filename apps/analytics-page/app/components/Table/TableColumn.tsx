import { FunctionComponent, HTMLProps, ReactNode } from 'react';
import { SkeletonWrapper } from '@xfai-labs/ui-components';
import cs from 'classnames';

export type TableColumnProps = {
  loading?: boolean;
  name?: string;
  align?: 'left' | 'center' | 'right';
  prepend?: ReactNode;
  append?: ReactNode;
} & Pick<HTMLProps<HTMLButtonElement>, 'onClick' | 'className' | 'children'>;

export const TableColumn: FunctionComponent<TableColumnProps> = ({
  loading,
  name,
  align = 'right',
  prepend,
  append,
  className,
  children,
  onClick,
}) => {
  const getAlignmentClassName = (): string => {
    switch (align) {
      case 'left':
        return 'justify-start';
      case 'center':
        return 'justify-center';
      default:
        return 'justify-end';
    }
  };

  const classNames = cs(
    className,
    'flex grow flex-row items-center justify-between px-3 lg:px-4 group-[.table-body]/table-row:py-2.5 md:group-[.table-body]/table-row:py-3.5 group-[.table-header]/table-row:py-5',
  );

  const content = (
    <>
      {name && <span className="lg:hidden">{name}</span>}
      <div className={cs('flex grow flex-row gap-1.5', getAlignmentClassName())}>
        {!loading ? (
          <>
            {prepend}
            {children}
            {append}
          </>
        ) : (
          <SkeletonWrapper>LOADING</SkeletonWrapper>
        )}
      </div>
    </>
  );

  if (onClick) {
    return (
      <button className={cs(classNames)} onClick={onClick}>
        {content}
      </button>
    );
  }

  return <div className={classNames}>{content}</div>;
};
