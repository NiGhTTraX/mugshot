import { expect } from 'chai';
import {
  runnerAfterEach,
  runnerBeforeEach,
  runnerDescribe,
  runnerIt
} from '../mocha-runner';

export { expect };

export function describe(name: string, definition: () => void) {
  runnerDescribe(name, () => {
    definition();
  });
}

export function it(name: string, definition?: () => Promise<any>|void) {
  runnerIt(name, definition);
}

export function beforeEach(definition: () => Promise<any>|void) {
  runnerBeforeEach(definition);
}

export function afterEach(definition: () => Promise<any>|void) {
  runnerAfterEach(definition);
}
