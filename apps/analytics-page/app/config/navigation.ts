import { NavigationItem } from '@xfai-labs/ui-components';
import MainConfig from '@analytics/config/MainConfig';
import Localization from '@analytics/localization';

const NavigationItems: NavigationItem[] = [
  {
    label: Localization.Navigation.BLOG,
    path: MainConfig.BLOG_URL,
    external: true,
  },
  {
    label: Localization.Navigation.FAQ,
    path: MainConfig.FAQ_URL,
    external: true,
  },
  {
    label: Localization.Navigation.ANALYTICS,
    path: 'https://analytics.xfai.com/',
    external: true,
  },
  {
    label: Localization.Navigation.DOCS,
    path: MainConfig.DOCUMENTATION_URL,
    external: true,
  },
];

export default NavigationItems;
