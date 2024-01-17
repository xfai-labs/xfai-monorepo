import { useState, useEffect } from 'react';
import { useWindowSize } from 'usehooks-ts';

const MOBILE_SCREEN_LIMIT = 992;

const useScreenSizeChange = () => {
  const { width } = useWindowSize();
  const [isMobile, setIsMobile] = useState<boolean>();

  useEffect(() => {
    setIsMobile(width < MOBILE_SCREEN_LIMIT);
  }, [width]);
  return {
    isMobile,
  };
};

export { useScreenSizeChange };
