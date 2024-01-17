import { FunctionComponent, ReactNode, SVGProps, createElement } from 'react';
import { IconArrowStemThickUp, IconArrowStemThickDown } from '@xfai-labs/ui-components';
import { TableColumn, TableColumnProps } from './TableColumn';

export type TableHeaderColumnProps = {
  order?: 'asc' | 'desc';
} & Omit<TableColumnProps, 'append'>;

export const TableHeaderColumn: FunctionComponent<TableHeaderColumnProps> = ({
  order,
  ...props
}) => {
  const getOrderIcon = (): FunctionComponent<SVGProps<SVGSVGElement>> | undefined => {
    switch (order) {
      case 'asc':
        return IconArrowStemThickUp;
      case 'desc':
        return IconArrowStemThickDown;
      default:
        return undefined;
    }
  };

  const getOrderIconElement = (): ReactNode | undefined => {
    const icon = getOrderIcon();

    if (icon) {
      return createElement(icon, { className: 'h-3 w-3 fill-20 dark:fill-10' });
    }
  };

  return <TableColumn append={getOrderIconElement()} {...props} />;
};
