import { TokenSelect as Select } from './TokenSelect';
import { TokenView as View } from './TokenView';
import { TokenTag as Tag } from './TokenTag';
import { TokenLocalList as LocalList } from './TokenLocalList';
import { TokenListProvider as ListProvider } from './TokenListProvider';
import { TokenAddressBox as AddressBox } from './TokenAddressBox';
import { TokenAmountBox as AmountBox } from './TokenAmountBox';
import { TokenSelectAmountBox as SelectAmountBox } from './TokenSelectAmountBox';
import { TokenSwapLogos as SwapLogos } from './TokenSwapLogos';

const Token = {
  Select,
  View,
  Tag,
  LocalList,
  ListProvider,
  AddressBox,
  AmountBox,
  SelectAmountBox,
  SwapLogos,
} as const;

export default Token;
