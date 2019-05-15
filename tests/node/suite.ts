import { expect } from 'chai';
import { runnerAfterEach, runnerBeforeEach, runnerDescribe, runnerIt } from '../mocha-runner';
import jimpDiffer from '../../packages/mugshot/src/lib/jimp-differ';

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

export async function compareBuffers(screenshot: Buffer, baseline: Buffer) {
  // We can't really compare the raw buffers because compression.
  const result = await jimpDiffer.compare(screenshot, baseline);
  expect(result.matches).to.be.true;
}
