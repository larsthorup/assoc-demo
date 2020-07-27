import * as assert from 'assert';
import { update } from './update';

type State = {
  chat: {
    contact: {
      [key: string]: { id: string; name: string };
    };
  };
};

const testAssign = () => {
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
        '1': { id: '1', name: 'Andrea' },
        '2': { id: '2', name: 'Kristian' },
      },
    },
  };

  const newState = update(state)
    .set((s) => s.chat.contact['1'])
    .to((_) => ({
      ..._,
      name: 'Andrea',
    }));
  assert.deepEqual(newState, expected);
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

  // assoc, type-safe, doesn't look mutable, no duplication
  const newState = update(state)
    .in((s) => s.chat.contact)
    .assoc({ [id]: contact });
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

  // dissoc, type-safe, doesn't look mutable, no duplication
  const newState = update(state)
    .in((s) => s.chat.contact)
    .dissoc(id);
  assert.deepEqual(newState, expected);
};

testAssign();
testAssoc();
testDissoc();
