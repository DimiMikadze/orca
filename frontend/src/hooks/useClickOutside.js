import { useEffect } from 'react';

/**
 * React hook that detects click outside an element
 *
 * @param {node} ref, element to detect click outside
 * @param {func} handler, function for invoking when click outside element is detected
 */
export const useClickOutside = (ref, handler) => {
  useEffect(() => {
    document.addEventListener('click', handleClickOutside, false);

    return () => {
      document.removeEventListener('click', handleClickOutside, false);
    };
  });

  const handleClickOutside = (event) => {
    if (ref.current && !ref.current.contains(event.target)) {
      handler();
    }
  };
};
