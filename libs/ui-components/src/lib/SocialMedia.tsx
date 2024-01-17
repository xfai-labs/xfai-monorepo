import SocialMediaItems from '../config/SocialMediaItems';
import cs from 'classnames';
import { HTMLProps, forwardRef, createElement } from 'react';

type Props = {
  border?: boolean;
  iconColor?: string;
  iconSize?: 'small' | 'medium';
  gap?: string;
} & HTMLProps<HTMLUListElement>;

const SocialMedia = forwardRef<HTMLUListElement, Props>(
  (
    {
      className,
      border = true,
      iconColor = 'fill-10 dark:fill-white',
      iconSize = 'medium',
      gap = 'gap-2.5 lg:gap-3 xl:gap-4',
      ...props
    },
    ref,
  ) => {
    const classNames = cs('flex flex-wrap', gap, className);

    return (
      <ul className={classNames} {...props} ref={ref}>
        {SocialMediaItems.map((item, index) => (
          <li key={index}>
            <a
              className={cs(
                'group/social-media relative block aspect-square before:absolute before:rounded-full',
                iconColor,
                border &&
                  'before:border-20 hover:before:border-10 before:inset-0 before:border-2 before:transition-all before:duration-75 before:content-[""] hover:before:border-[3px] dark:before:border-white dark:hover:before:border-white',
                iconSize === 'small' ? 'w-6' : 'w-8',
              )}
              href={item.link}
              aria-label={item.label}
              target="_blank"
              rel="noreferrer"
            >
              {createElement(item.icon, {
                className: cs(
                  'w-4 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2',
                  border &&
                    'scale-100 group-hover/social-media:scale-90 transition-[transform] duration-75',
                ),
              })}
            </a>
          </li>
        ))}
      </ul>
    );
  },
);

export default SocialMedia;
