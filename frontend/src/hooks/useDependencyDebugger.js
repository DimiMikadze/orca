import { useRef, useMemo } from 'react';

/**
 * Compares inputs and console logs changes
 *
 * @param {array} inputKeys
 * @param {array} oldInputs
 * @param {array} newInputs
 */
const compareInputs = (inputKeys, oldInputs, newInputs) => {
  inputKeys.forEach(key => {
    const oldInput = oldInputs[key];
    const newInput = newInputs[key];

    if (oldInput !== newInput) {
      console.log('change detected', key, 'old:', oldInput, 'new:', newInput);
    }
  });
};

/**
 * Hook for detecting dependency array changes, meant to be used for debugging
 */
export const useDependencyDebugger = inputs => {
  const oldInputsRef = useRef(inputs);
  const inputValuesArray = Object.values(inputs);
  const inputKeysArray = Object.keys(inputs);

  useMemo(() => {
    const oldInputs = oldInputsRef.current;

    compareInputs(inputKeysArray, oldInputs, inputs);

    oldInputsRef.current = inputs;
  }, inputValuesArray); // eslint-disable-line react-hooks/exhaustive-deps
};
