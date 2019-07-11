// @ts-ignore https://github.com/facebook/jest/pull/7571
const { afterAll, afterEach, beforeAll, beforeEach, describe, it } = global;

export {
  describe as runnerDescribe,
  beforeEach as runnerBeforeEach,
  afterEach as runnerAfterEach,
  beforeAll as runnerBefore,
  afterAll as runnerAfter,
  it as runnerIt
};
