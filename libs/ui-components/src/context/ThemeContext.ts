/* eslint-disable @typescript-eslint/no-empty-function */
import { createContext, Dispatch, SetStateAction, useContext } from 'react';
export type TernaryDarkMode = 'system' | 'dark' | 'light';
export type UseTernaryDarkModeOutput = {
  isDarkMode: boolean;
  ternaryDarkMode: TernaryDarkMode;
  setTernaryDarkMode: Dispatch<SetStateAction<TernaryDarkMode>>;
  toggleTernaryDarkMode: () => void;
};
export const ThemeContext = createContext<UseTernaryDarkModeOutput>({
  toggleTernaryDarkMode: () => {},
  isDarkMode: false,
  ternaryDarkMode: 'system',
  setTernaryDarkMode: () => {},
});

export const useThemeContext = () => useContext(ThemeContext);
