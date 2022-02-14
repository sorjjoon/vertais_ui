import React, { useCallback } from "react";

export function useArrayState<T>(initialValue: T[], comparator = (a: T, b: T) => a === b) {
  const [arr, setArr] = React.useState(initialValue);

  const pushToArr = useCallback(
    (val: T) => {
      arr.push(val);
      setArr([...arr]);
    },
    [arr]
  );

  const filterArr = useCallback(
    (val: T, predicate = comparator) => {
      const filtered = arr.filter((x) => !predicate(val, x));
      setArr(filtered);
    },
    [arr]
  );

  const findFromArr = useCallback(
    (val: T, predicate = comparator) => {
      return arr.find((x) => predicate(val, x));
    },
    [arr]
  );

  const helpers = { setArr, pushToArr, filterArr, findFromArr };
  return [arr, helpers] as [T[], typeof helpers];
}
