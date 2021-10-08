import { useState, useEffect } from 'react';
import throttle from 'lodash/throttle';
import theme from '../theme';

const getDeviceConfig = (width: number) => {
  const xs = parseInt(theme.screen.xs, 10);
  const sm = parseInt(theme.screen.sm, 10);
  const md = parseInt(theme.screen.md, 10);
  const lg = parseInt(theme.screen.lg, 10);
  const xl = parseInt(theme.screen.xl, 10);

  if (width < xs) {
    return 'xs';
  } else if (width >= xs && width < sm) {
    return 'sm';
  } else if (width >= sm && width < md) {
    return 'md';
  } else if (width >= md && width < lg) {
    return 'lg';
  } else if (width >= lg && width < xl) {
    return 'lg';
  } else if (width >= xl) {
    return 'xl';
  }
};

const useBreakpoints = () => {
  const [breakPoint, setBreakPoint] = useState(() => getDeviceConfig(window.innerWidth));

  useEffect(() => {
    const calcInnerWidth = throttle(function () {
      setBreakPoint(getDeviceConfig(window.innerWidth));
    }, 200);

    window.addEventListener('resize', calcInnerWidth);

    return () => window.removeEventListener('resize', calcInnerWidth);
  }, []);

  return breakPoint;
};

export default useBreakpoints;
