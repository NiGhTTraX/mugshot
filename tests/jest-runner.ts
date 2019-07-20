// @ts-ignore https://github.com/facebook/jest/pull/7571
const { afterAll, afterEach, beforeAll, beforeEach, describe, it } = global;

// TODO: move to config after https://github.com/facebook/jest/pull/8456 ships
const TIMEOUT = 20 * 1000;

export { describe as runnerDescribe };

export function runnerIt(name: string, definition: () => Promise<any>|void) {
  it(name, definition, TIMEOUT);
}

export function runnerBeforeEach(definition: () => Promise<any>|void) {
  beforeEach(definition, TIMEOUT);
}

export function runnerAfterEach(definition: () => Promise<any>|void) {
  afterEach(definition, TIMEOUT);
}

export function runnerBefore(definition: () => Promise<any>|void) {
  beforeAll(definition, TIMEOUT);
}

export function runnerAfter(definition: () => Promise<any>|void) {
  afterAll(definition, TIMEOUT);
}
