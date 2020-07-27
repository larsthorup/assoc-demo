import { assign } from './assign';
import * as dict from './dict';

class Update<S> {
  private s: S;
  constructor(s: S) {
    this.s = s;
  }
  set<P>(selector: (s: S) => P): UpdateObject<S, P> {
    return new UpdateObject(this.s, selector);
  }
  in<V>(selector: (s: S) => { [key: string]: V }): UpdateDict<S, V> {
    return new UpdateDict(this.s, selector);
  }
}

class UpdateObject<S, P> {
  private s: S;
  private selector: (s: S) => P;
  constructor(s: S, selector: (s: S) => P) {
    this.s = s;
    this.selector = selector;
  }
  to(creator: (p: Readonly<P>) => P): S {
    return assign(this.selector, creator, this.s);
  }
}

class UpdateDict<S, V> {
  private s: S;
  private selector: (s: S) => { [key: string]: V };
  constructor(s: S, selector: (s: S) => { [key: string]: V }) {
    this.s = s;
    this.selector = selector;
  }
  assoc(d: { [key: string]: V }): S {
    return dict.assoc(this.selector, d, this.s);
  }
  dissoc(key: string): S {
    return dict.dissoc(this.selector, key, this.s);
  }
  touch(key: string, value: V): S {
    return dict.touch(this.selector, key, value, this.s);
  }
}

export const update: <S>(s: S) => Update<S> = (s) => {
  return new Update(s);
};
