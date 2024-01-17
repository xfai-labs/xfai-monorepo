import SocialMediaItem from '../types/SocialMediaItem';
import {
  SocialDiscord,
  SocialGithub,
  SocialTelegram,
  SocialTwitter,
  SocialMedium,
} from '../lib/assets/icons';

const SocialMediaItems: SocialMediaItem[] = [
  {
    label: 'Discord',
    icon: SocialDiscord,
    link: 'https://discord.gg/qTYWpyD8TU',
  },
  {
    label: 'Telegram',
    icon: SocialTelegram,
    link: 'https://t.me/xfaiofficial',
  },
  {
    label: 'Twitter',
    icon: SocialTwitter,
    link: 'https://twitter.com/xfai_official',
  },
  {
    label: 'Github',
    icon: SocialGithub,
    link: 'https://github.com/xfai-labs',
  },
  {
    label: 'Medium',
    icon: SocialMedium,
    link: 'https://medium.com/xfai-official',
  },
];

export default SocialMediaItems;
