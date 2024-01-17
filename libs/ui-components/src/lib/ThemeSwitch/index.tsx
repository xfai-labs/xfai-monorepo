import { useEffect, useRef, useState } from 'react';
import Lottie, { LottieRefCurrentProps } from 'lottie-react';
import { Switch } from '@headlessui/react';
import { useThemeContext } from '../../context/ThemeContext';
import ThemeSwitchAnimation from './theme_switch.json';
import cs from 'classnames';

export default function ThemeSwitch() {
  const [isHovering, setIsHovering] = useState(false);
  const { setTernaryDarkMode, isDarkMode } = useThemeContext();
  const lottieRef = useRef<LottieRefCurrentProps>(null);

  useEffect(() => {
    if (isDarkMode) {
      lottieRef?.current?.playSegments([17, 30], true);
    } else {
      lottieRef?.current?.playSegments([14, 0], true);
    }
    setIsHovering(false);
  }, [isDarkMode, lottieRef]);

  return (
    <Switch
      checked={false}
      onChange={() => setTernaryDarkMode(isDarkMode ? 'light' : 'dark')}
      className={cs('relative -mr-1.5 inline-flex items-center')}
      onMouseEnter={() => {
        setIsHovering(true);
        if (isDarkMode) {
          lottieRef?.current?.playSegments([30, 14], true);
        } else {
          lottieRef?.current?.playSegments([0, 17], true);
        }
      }}
      onMouseLeave={() => {
        if (isHovering) {
          if (isDarkMode) {
            lottieRef?.current?.playSegments([14, 30], true);
          } else {
            lottieRef?.current?.playSegments([17, 0], true);
          }
          setIsHovering(false);
        }
      }}
    >
      <span className="sr-only">Switch Theme</span>
      <Lottie
        lottieRef={lottieRef}
        animationData={ThemeSwitchAnimation}
        autoPlay={false}
        loop={false}
        className="[&_*]:!fill-bg [&_*]:!stroke-white-blue [&_.moonFill]:!fill-white-blue h-9 [&>svg]:!w-auto"
      />
    </Switch>
  );
}
