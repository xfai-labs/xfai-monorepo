import { FunctionComponent, useEffect, useRef } from 'react';
import cs from 'classnames';

type Props = {
  mono?: boolean;
  type?: 'spinner' | 'header';
  className?: string;
};

const AnimatedLogoIcon: FunctionComponent<Props> = ({ mono, type, className }) => {
  const logoIconRef = useRef<SVGSVGElement>(null);

  const animationTypeClass = cs('logo-icon-animated', {
    'logo-icon-animated-init': type === 'header',
    'logo-icon-animated-loop': type === 'spinner',
  });

  useEffect(() => {
    if (type !== 'header') {
      return () => null;
    }
    const timeout = setTimeout(() => {
      if (logoIconRef.current?.classList.contains('logo-icon-animated-init')) {
        logoIconRef.current?.classList.remove('logo-icon-animated-init');
      }
    }, 30000);

    return () => clearTimeout(timeout);
  }, [type, logoIconRef]);

  const addRepeatClass = (): void | (() => void) => {
    if (type !== 'header') {
      return;
    }
    if (logoIconRef.current?.classList.contains('logo-icon-animated-init')) {
      logoIconRef.current?.classList.remove('logo-icon-animated-init');
    }

    if (!logoIconRef.current?.classList.contains('logo-icon-animated-hover')) {
      logoIconRef.current?.classList.add('logo-icon-animated-hover');

      const timeout = setTimeout(() => {
        logoIconRef.current?.classList.remove('logo-icon-animated-hover');
      }, 30000);
      return () => clearTimeout(timeout);
    }
    return;
  };

  return (
    <svg
      ref={logoIconRef}
      className={cs(animationTypeClass, className)}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 112 112"
      onMouseEnter={addRepeatClass}
    >
      <path
        className="spinner-track fill-70"
        d="M81,56l-8.26,8.26,37.49,37.48A6,6,0,0,1,106,112H72.71a6.49,6.49,0,0,1-4.6-1.9L56,98,43.89,110.1a6.49,6.49,0,0,1-4.6,1.9H6a6,6,0,0,1-4.25-10.26L39.26,64.26l8.48,8.48L21.51,99a.6.6,0,0,0,.42,1H35.56A3.5,3.5,0,0,0,38,99L56,81,74,99a3.5,3.5,0,0,0,2.48,1H90.07a.6.6,0,0,0,.42-1L64.26,72.74,56,81V31l-8.26,8.26L21.51,13a.6.6,0,0,1,.42-1H35.56A3.5,3.5,0,0,1,38,13L56,31,74,13a3.5,3.5,0,0,1,2.48-1H90.07a.6.6,0,0,1,.42,1L64.26,39.26l8.48,8.48,37.49-37.48A6,6,0,0,0,106,0H72.71a6.49,6.49,0,0,0-4.6,1.9L56,14,43.89,1.9A6.49,6.49,0,0,0,39.29,0H6A6,6,0,0,0,1.77,10.26L39.26,47.74,31,56Z"
      />

      <polyline
        className={cs('arrow arrow-top', !mono ? 'stroke-magenta' : 'stroke-white')}
        points="68.5 43.5 106 6 72.5 6 56 -10.5 39.5 6 6 6 56 56"
      />
      <polyline
        className={cs('arrow arrow-bottom', !mono ? 'stroke-cyan' : 'stroke-white')}
        points="43.5 68.5 6 106 39.5 106 56 122.5 72.5 106 106 106 56 56"
      />

      <polyline
        className={cs('line line-top', !mono ? 'stroke-magenta' : 'stroke-white')}
        points="68.5 43.5 106 6 72.5 6 56 22.5 39.5 6 6 6 56 56"
      />
      <polyline
        className={cs('line line-bottom', !mono ? 'stroke-cyan' : 'stroke-white')}
        points="43.5 68.5 6 106 39.5 106 56 89.5 72.5 106 106 106 56 56"
      />

      <defs>
        <clipPath id="lines-clipPath">
          <path
            className="b"
            d="M45.76,45.76,50,41.52,21.51,13a.6.6,0,0,1,.42-1H35.56A3.5,3.5,0,0,1,38,13L56,31,74,13a3.5,3.5,0,0,1,2.48-1H90.07a.6.6,0,0,1,.42,1L64.26,39.26l8.48,8.48,37.49-37.48A6,6,0,0,0,106,0H72.71a6.49,6.49,0,0,0-4.6,1.9L56,14,43.89,1.9A6.49,6.49,0,0,0,39.29,0H6A6,6,0,0,0,1.77,10.26L41.51,50l4.25-4.24L66.24,66.24,62,70.49,90.49,99a.6.6,0,0,1-.42,1H76.44A3.5,3.5,0,0,1,74,99L56,81,38,99a3.5,3.5,0,0,1-2.48,1H21.93a.6.6,0,0,1-.42-1L47.74,72.74l-8.48-8.48L1.77,101.74A6,6,0,0,0,6,112H39.29a6.49,6.49,0,0,0,4.6-1.9L56,98,68.11,110.1a6.49,6.49,0,0,0,4.6,1.9H106a6,6,0,0,0,4.25-10.26L70.49,62l-4.25,4.24Z"
          />
        </clipPath>
        <clipPath id="arrows-clipPath">
          <polygon points="56 81 81 56 31 56 56 31 56 81" />
        </clipPath>
      </defs>
    </svg>
  );
};

export default AnimatedLogoIcon;
