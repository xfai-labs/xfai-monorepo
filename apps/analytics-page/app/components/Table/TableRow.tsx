import { FunctionComponent, HTMLProps } from 'react';
import cs from 'classnames';

export type TableRowProps = {
  type?: 'header' | 'body';
  columns?: 'auto' | 'custom' | 'pools';
  columnsClassName?: string;
} & HTMLProps<HTMLDivElement>;

export const TableRow: FunctionComponent<TableRowProps> = ({
  className,
  type = 'body',
  columns = 'auto',
  columnsClassName,
  children,
  ...props
}) => {
  const getColumnsClassNames = (): string => {
    switch (columns) {
      case 'custom':
        return `grid ${columnsClassName}` ?? 'flex flex-col lg:flex-row';
      case 'pools':
        return 'grid lg:grid-cols-pools';
      default:
        return 'flex flex-col lg:flex-row';
    }
  };

  const getTypeClassNames = (): string | undefined => {
    switch (type) {
      case 'header':
        return 'table-header font-medium !hidden lg:!grid';
      default:
        return 'table-body';
    }
  };

  return (
    <div
      className={cs(
        'group/table-row',
        className,
        getColumnsClassNames(),
        'items-center',
        getTypeClassNames(),
        'even:bg-black-white/30 dark:even:bg-black-white/20',
        'py-1.5 md:py-0',
        type === 'body' && 'hover:!bg-white-black/5',
      )}
      {...props}
    >
      {children}
    </div>
  );
};
