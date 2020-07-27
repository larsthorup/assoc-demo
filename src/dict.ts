import { assign } from './assign';

/**
 * Return a copy of `s`,
 * where the dict returned by `get` has items from `d` added
 * with maximum sharing between `s` and the result
 * @param get branch accessor (use `.prop` or `[index]`)
 * @param d items to add
 * @param s the object to copy
 */
export const assoc: <S, V>(
  get: (s: S) => { [key: string]: V },
  d: { [key: string]: V },
  s: S
) => S = (get, d, s) => {
  return assign(get, (_) => ({ ..._, ...d }), s);
};

/**
 * Return a copy of `s`,
 * where the dict returned by `get` has `key` removed
 * with maximum sharing between `s` and the result
 * @param get branch accessor (use `.prop` or `[index]`)
 * @param key the item to remove
 * @param s the object to copy
 */
export const dissoc: <S, V>(
  get: (s: S) => { [key: string]: V },
  key: string,
  s: S
) => S = (get, key, s) => {
  return assign(
    get,
    (p) => {
      const { [key]: _, ...butKey } = p;
      return butKey as typeof p;
    },
    s
  );
};

/**
 * Return a copy of `s`
 * where the dict returned by `get` has `value` added at `key`
 * unless `key`already exists
 * with maximum sharing between `s` and the result
 * @param get branch accessor (use `.prop` or `[index]`)
 * @param value the value to add
 * @param key the item to touch
 * @param s the object to copy
 */
export const touch: <S, V>(
  get: (s: S) => { [key: string]: V },
  key: string,
  value: V,
  s: S
) => S = (get, key, value, s) => {
  if (get(s)[key]) {
    return s;
  } else {
    return assign(get, (_) => ({ ..._, [key]: value }), s);
  }
};
