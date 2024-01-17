import { TableWrapper as Wrapper } from './TableWrapper';
import { TableRow as Row } from './TableRow';
import { TableColumn as Column } from './TableColumn';
import { TableHeaderColumn as HeaderColumn } from './TableHeaderColumn';

const Token = {
  Wrapper,
  Row,
  Column,
  HeaderColumn,
} as const;

export default Token;
