import landingLocation from '@dapp/utils/landingLocation';
import { NavigationItem } from '@xfai-labs/ui-components';
import MainConfig from './MainConfig';

const ExternalNavigationItems: NavigationItem[] = [
  {
    label: 'Blog',
    path: MainConfig.BLOG_URL,
    external: true,
  },
  {
    label: 'FAQ',
    path: landingLocation('/faq'),
    external: true,
  },
  {
    label: 'Docs',
    path: MainConfig.DOCUMENTATION_URL,
    external: true,
  },
];

export default ExternalNavigationItems;
