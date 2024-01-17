import { NavigationItem } from '@xfai-labs/ui-components';
import Localization from '@landing/localization';
import MainConfig from '@landing/config/MainConfig';

const NavigationItems: NavigationItem[] = [
  {
    label: Localization.BLOG,
    path: MainConfig.BLOG_URL,
    external: true,
  },
  {
    label: Localization.FAQ,
    path: '/faq',
  },
  {
    label: Localization.ANALYTICS,
    path: MainConfig.ANALYTICS_URL,
    external: true,
  },
  {
    label: Localization.DOCS,
    path: MainConfig.DOCUMENTATION_URL,
    external: true,
  },
];

export default NavigationItems;
