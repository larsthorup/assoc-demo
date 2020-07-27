import * as assert from 'assert';
import * as R from 'ramda';
import produce from 'immer';
import iassign from 'immutable-assign';
import { assign } from './assign';
import { update } from './update';

type State = {
  chat: {
    contact: {
      [key: string]: { id: string; name: string };
    };
  };
};

const state: State = {
  chat: {
    contact: {
      '1': { id: '1', name: 'Lars' },
      '2': { id: '2', name: 'Kristian' },
    },
  },
};
const expected: State = {
  chat: {
    contact: {
      '1': { id: '1', name: 'Laura' },
      '2': { id: '2', name: 'Kristian' },
    },
  },
};

const key = '1';

// typescript, duplicated identifiers
const newStateTS: State = {
  ...state,
  chat: {
    ...state.chat,
    contact: {
      ...state.chat.contact,
      [key]: {
        ...state.chat.contact[key],
        name: 'Laura',
      },
    },
  },
};
assert.deepEqual(newStateTS, expected);

// ramda, not type safe, not refactorable
const newStateRamda: State = R.assocPath(
  ['chat', 'contact', key, 'name'],
  'Laura',
  state
);
assert.deepEqual(newStateRamda, expected);

// immer, looks mutable
const newStateImmer = produce(state, (draft) => {
  draft.chat.contact[key].name = 'Laura';
});
assert.deepEqual(newStateImmer, expected);

// iassign, looks somewhat mutable
const newStateIassign = iassign(
  state,
  (s) => s.chat.contact[key],
  (c) => {
    c.name = 'Laura';
    return c;
  }
);
assert.deepEqual(newStateIassign, expected);

// assign: type-safe, doesn't look mutable, no duplication
const newStateAssign = assign(
  (state) => state.chat.contact[key],
  (c) => ({ ...c, name: 'Laura' }),
  state
);
assert.deepEqual(newStateAssign, expected);

// update: type-safe, doesn't look mutable, no duplication, fluent
const newState = update(state)
  .set((state) => state.chat.contact[key])
  .to((c) => ({ ...c, name: 'Laura' }));
assert.deepEqual(newState, expected);
