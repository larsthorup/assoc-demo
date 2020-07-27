import * as assert from 'assert';
import { assign } from './assign';

const testUpdateLeaf = () => {
  const state = {
    chat: {
      contact: {
        '1': { id: '1', name: 'Lars' },
        '2': { id: '2', name: 'Kristian' },
      },
    },
  };
  const newState = assign(
    (s) => s.chat.contact['1'].name,
    (_) => 'Laura',
    state
  );
  assert.deepEqual(newState, {
    chat: {
      contact: {
        '1': { id: '1', name: 'Laura' },
        '2': { id: '2', name: 'Kristian' },
      },
    },
  });
  assert.deepEqual(state, {
    chat: {
      contact: {
        '1': { id: '1', name: 'Lars' },
        '2': { id: '2', name: 'Kristian' },
      },
    },
  });
  assert.equal(newState.chat.contact['2'], state.chat.contact['2']);
};

const testUpdateNonLeaf = () => {
  const state = {
    chat: {
      contact: {
        '1': { id: '1', name: 'Lars' },
        '2': { id: '2', name: 'Kristian' },
      },
    },
  };
  const newState = assign(
    (s) => s.chat.contact['1'],
    (c) => ({ ...c, name: 'Laura' }),
    state
  );
  assert.deepEqual(newState, {
    chat: {
      contact: {
        '1': { id: '1', name: 'Laura' },
        '2': { id: '2', name: 'Kristian' },
      },
    },
  });
  assert.deepEqual(state, {
    chat: {
      contact: {
        '1': { id: '1', name: 'Lars' },
        '2': { id: '2', name: 'Kristian' },
      },
    },
  });
  assert.equal(newState.chat.contact['2'], state.chat.contact['2']);
};

const testAddNode = () => {
  const state = {
    chat: {
      contact: {
        '1': { id: '1', name: 'Lars' },
        '2': { id: '2', name: 'Kristian' },
      },
    },
  };
  const newState = assign(
    (s) => s.chat.contact,
    (c) => ({ ...c, '3': { id: '3', name: 'Laura' } }),
    state
  );
  assert.deepEqual(newState, {
    chat: {
      contact: {
        '1': { id: '1', name: 'Lars' },
        '2': { id: '2', name: 'Kristian' },
        '3': { id: '3', name: 'Laura' },
      },
    },
  });
  assert.deepEqual(state, {
    chat: {
      contact: {
        '1': { id: '1', name: 'Lars' },
        '2': { id: '2', name: 'Kristian' },
      },
    },
  });
  assert.equal(newState.chat.contact['1'], state.chat.contact['1']);
  assert.equal(newState.chat.contact['2'], state.chat.contact['2']);
};

testUpdateLeaf();
testUpdateNonLeaf();
testAddNode();
