import * as assert from 'assert';
import * as R from 'ramda';
import produce from 'immer';
import iassign from 'immutable-assign';
import { assign } from './assign';

const ops = 10000;
const opsPerSecond = (start: bigint) => {
  const ms = Number((process.hrtime.bigint() - start) / BigInt(1e6));
  return Math.trunc(1000 / (ms / ops));
};

const state = {
  chat: {
    contact: {
      '1': { id: '1', name: 'Lars' },
      '2': { id: '2', name: 'Kristian' },
    },
  },
};

const key = 1;

const testPerformance = () => {
  // ramda
  const ramdaStart = process.hrtime.bigint();
  for (let i = 0; i < ops; ++i) {
    const newStateRamda = R.assocPath(
      ['chat', 'contact', '1', 'name'],
      'Laura',
      state
    );
  }
  const ramdaOpsPerSecond = opsPerSecond(ramdaStart);
  console.log(`ramda: ${ramdaOpsPerSecond} ops/sec`);

  // typescript
  const typescriptStart = process.hrtime.bigint();
  for (let i = 0; i < ops; ++i) {
    const newStateTS = {
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
  }
  const typescriptOpsPerSecond = opsPerSecond(typescriptStart);
  console.log(`typescript: ${typescriptOpsPerSecond} ops/sec`);

  // update
  const assocStart = process.hrtime.bigint();
  for (let i = 0; i < ops; ++i) {
    const newState = assign(
      (s) => s.chat.contact[key],
      (c) => ({ ...c, name: 'Laura' }),
      state
    );
  }
  const assocOpsPerSecond = opsPerSecond(assocStart);
  console.log(`assign: ${assocOpsPerSecond} ops/sec`);

  // iassign
  const iassignStart = process.hrtime.bigint();
  for (let i = 0; i < ops; ++i) {
    const newStateIassign = iassign(
      state,
      (s) => s.chat.contact[key],
      (c) => {
        c.name = 'Laura';
        return c;
      }
    );
  }
  const iassignOpsPerSecond = opsPerSecond(iassignStart);
  console.log(`iassign: ${iassignOpsPerSecond} ops/sec`);

  // immer
  const immerStart = process.hrtime.bigint();
  for (let i = 0; i < ops; ++i) {
    const newStateImmer = produce(state, (draft) => {
      draft.chat.contact[1].name = 'Laura';
    });
  }
  const immerOpsPerSecond = opsPerSecond(immerStart);
  console.log(`immer: ${immerOpsPerSecond} ops/sec`);
};

testPerformance();
