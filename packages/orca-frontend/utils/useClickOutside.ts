import { useEffect, RefObject } from 'react';

const useClickOutside = (
  // Element(s) of which outside click should be detected.
  ref: RefObject<HTMLDivElement> | RefObject<HTMLDivElement>[],
  // Whether the handler should be fired.
  fireHandler: boolean,
  // A function that should be called when clicking outside the element.
  handler: () => void
): void => {
  useEffect(() => {
    if (!fireHandler) {
      return;
    }

    function handleSingleRef(event) {
      const currentRef = ref as RefObject<HTMLDivElement>;
      if (currentRef.current && !currentRef.current.contains(event.target)) {
        handler();
      }
    }

    function handleMultipleRef(event) {
      let refExists = true;
      const refs = ref as Array<RefObject<HTMLDivElement>>;
      refs.some((ref) => {
        if (!ref.current || (ref.current && ref.current.contains(event.target))) {
          refExists = false;
        }
      });

      if (fireHandler && refExists) {
        handler();
      }
    }

    const listenerHandler = Array.isArray(ref) ? handleMultipleRef : handleSingleRef;

    document.addEventListener('mousedown', listenerHandler);

    return () => document.removeEventListener('mousedown', listenerHandler);
  }, [ref, handler, fireHandler]);
};

export default useClickOutside;
