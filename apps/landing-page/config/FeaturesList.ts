import Localization from '@landing/localization';
import EntangledSwapsImage from '@landing/public/features/entangled_swaps.webp';
import InfinityStakingImage from '@landing/public/features/infinity_staking.webp';
import DeepLiquidityPoolsImage from '@landing/public/features/deep_liquidity_pools.webp';
import ManageLiquidityImage from '@landing/public/features/manage_liquidity.webp';

const FeaturesList = [
  {
    name: Localization.ENTANGLED_SWAPS_TITLE,
    description: Localization.ENTANGLED_SWAPS_DESCRIPTION,
    link: 'https://docs.xfai.com/products/guides/performing-swaps',
    image: EntangledSwapsImage,
  },
  {
    name: Localization.INFINITY_STAKING_TITLE,
    description: Localization.INFINITY_STAKING_DESCRIPTION,
    link: 'https://docs.xfai.com/products/guides/infinity-staking',
    image: InfinityStakingImage,
  },
  {
    name: Localization.DEEP_LIQUIDITY_POOLS_TITLE,
    description: Localization.DEEP_LIQUIDITY_POOLS_DESCRIPTION,
    link: 'https://docs.xfai.com/products/guides/providing-liquidity',
    image: DeepLiquidityPoolsImage,
  },
  {
    name: Localization.MANAGE_LIQUIDITY_TITLE,
    description: Localization.MANAGE_LIQUIDITY_DESCRIPTION,
    link: 'https://docs.xfai.com/products/guides/redeeming-liquidity',
    image: ManageLiquidityImage,
  },
];

export default FeaturesList;
