import * as R from 'ramda';

// See: https://www.fullstackagile.eu/2020/07/31/typesafe-immutable-readable/

/**
 * Return a copy of `s`, where the branch returned by `get`
 * is replaced with the branch returned by `set`
 * with maximum sharing between `s` and the result
 * @param get branch accessor (use `.prop` or `[index]`)
 * @param set can immutably modify the passed in branch (`(_) => ({..._})`)
 * @param s the object to copy
 */
export const assign: <S, P>(
  get: (s: S) => P,
  set: (p: Readonly<P>) => P,
  s: S
) => S = (get, set, s) => {
  const path = [] as string[];
  const sInstrumented = instrument(s, path, 0);
  get(sInstrumented); // Note: compute "path", ignore return value, as it is the "wrong" object
  const originalValue = get(s);
  const newValue = set(originalValue);
  return R.assocPath(path, newValue, s);
};

const instrument: (obj: any, path: string[], level: number) => any = (
  obj,
  path,
  level
) => {
  const handlers = {
    get: (_: any, key: string) => {
      const value = obj[key];
      if (level === path.length) {
        path.push(key);
        if (typeof value === 'object' && value !== null) {
          return instrument(value, path, level + 1);
        }
      }
      return value;
    },
  };
  return new Proxy(shallowCopy(obj), handlers);
};

const shallowCopy = (value: any) => {
  if (value !== undefined && !(value instanceof Date)) {
    if (value instanceof Array) {
      return value.slice();
    } else if (typeof value === 'object') {
      return Object.assign({}, value);
    }
  }
  return value;
};
