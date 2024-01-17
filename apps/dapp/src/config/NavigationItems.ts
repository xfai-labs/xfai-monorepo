import { NavigationItem, TabINFT, TabLiquidity, TabStake, TabSwap } from '@xfai-labs/ui-components';

const NavigationItems: NavigationItem[] = [
  {
    label: 'Swap',
    path: 'swap',
    icon: TabSwap,
  },
  {
    label: 'Liquidity',
    path: 'liquidity',
    icon: TabLiquidity,
  },
  {
    label: 'Stake',
    path: 'stake',
    icon: TabStake,
  },
  {
    label: 'INFTs',
    path: 'inft',
    icon: TabINFT,
  },
];

export default NavigationItems;
