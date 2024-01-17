import { useEffect } from 'react';
import { useTernaryDarkMode } from 'usehooks-ts';
import { UseTernaryDarkModeOutput } from '../../context/ThemeContext';

const changeThemeClass = (isDarkMode: boolean) => {
  const root = document.querySelector(':root');
  root?.classList.remove(isDarkMode ? 'light' : 'dark');
  root?.classList.add(isDarkMode ? 'dark' : 'light');
};

const useInitThemeContext = (): UseTernaryDarkModeOutput => {
  const themeContext = useTernaryDarkMode();

  useEffect(() => {
    changeThemeClass(themeContext.isDarkMode);
  }, [themeContext.isDarkMode]);

  return themeContext;
};

export default useInitThemeContext;
