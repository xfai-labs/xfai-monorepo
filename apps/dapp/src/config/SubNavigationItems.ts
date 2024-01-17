import analyticsLocation from '@dapp/utils/analyticsLocation';
import landingLocation from '@dapp/utils/landingLocation';
import {
  IconAnalytics,
  IconDocs,
  IconEdit,
  IconFaq,
  NavigationItem,
} from '@xfai-labs/ui-components';
import MainConfig from './MainConfig';

const SubNavigationItems: NavigationItem[] = [
  {
    label: 'Analytics',
    path: analyticsLocation(),
    icon: IconAnalytics,
    external: true,
  },
  {
    label: 'Blog',
    path: MainConfig.BLOG_URL,
    icon: IconEdit,
    external: true,
  },
  {
    label: 'Documentation',
    path: MainConfig.DOCUMENTATION_URL,
    icon: IconDocs,
    external: true,
  },
  {
    label: 'FAQ',
    path: landingLocation('/faq'),
    icon: IconFaq,
    external: true,
  },
];

export default SubNavigationItems;
