import * as assert from 'assert';
import * as R from 'ramda';

import { assoc, dissoc } from './dict';

type State = {
  chat: {
    contact: {
      [key: string]: { id: string; name: string };
    };
  };
};

const testAssoc = () => {
  const state: State = {
    chat: {
      contact: {
        '2': { id: '2', name: 'Kristian' },
      },
    },
  };
  const id = '1';
  const contact = { id, name: 'Lars' };
  const expected: State = {
    chat: {
      contact: {
        '1': { id: '1', name: 'Lars' },
        '2': { id: '2', name: 'Kristian' },
      },
    },
  };

  // typescript, duplicated identifiers
  const newStateT = {
    ...state,
    chat: {
      ...state.chat,
      contact: {
        ...state.chat.contact,
        [id]: contact,
      },
    },
  };
  assert.deepEqual(newStateT, expected);

  // ramda, not type safe, not refactorable
  const newStateRamda = R.assocPath(['chat', 'contact', id], contact, state);
  assert.deepEqual(newStateRamda, expected);

  // assoc, type-safe, doesn't look mutable, no duplication
  const newState = assoc((s) => s.chat.contact, { [id]: contact }, state);
  assert.deepEqual(newState, expected);
};

const testDissoc = () => {
  const state: State = {
    chat: {
      contact: {
        '1': { id: '1', name: 'Lars' },
        '2': { id: '2', name: 'Kristian' },
      },
    },
  };
  const id = '1';
  const expected: State = {
    chat: {
      contact: {
        '2': { id: '2', name: 'Kristian' },
      },
    },
  };

  // typescript, duplicated identifiers
  const { [id]: contact, ...contactButId } = state.chat.contact;
  const newStateT = {
    ...state,
    chat: {
      ...state.chat,
      contact: {
        ...contactButId,
      },
    },
  };
  assert.deepEqual(newStateT, expected);

  // ramda, not type safe, not refactorable
  const newStateRamda = R.dissocPath(['chat', 'contact', id], state);
  assert.deepEqual(newStateRamda, expected);

  // dissoc, type-safe, doesn't look mutable, no duplication
  const newState = dissoc((s) => s.chat.contact, id, state);
  assert.deepEqual(newState, expected);
};

testAssoc();
testDissoc();
