import { inspect, isDeepStrictEqual } from 'util';

interface Expectation<T> {
  args?: any[];
  r: any;
  met: boolean;
}

export type Stub<T, R> = {
  returns(r: R): void;
}

export class CallExpectation<T> implements Expectation<T> {
  public args: any;

  public r: any;

  public met: boolean;

  constructor(args: any, r: any) {
    this.args = args;
    this.met = false;
    this.r = r;
  }

  toString() {
    return `${inspect(this.args)} => ${inspect(this.r)}`;
  }
}

export class PropertyExpectation<T> implements Expectation<T> {
  public r: any;

  public met: boolean;

  constructor(r: any) {
    this.met = false;
    this.r = r;
  }

  toString() {
    return `=> ${inspect(this.r)}`;
  }
}

/**
 * Replacement mocking library for typemoq with better error messages
 * (includes function names and stringified arguments).
 *
 * Mocks are strict by default - an unexpected call will throw an error
 * and so will a call with more params than expected.
 */
export default class XMock<T> {
  private expectations: Map<string, Expectation<T>[]> = new Map();

  // TODO: implement It.isAny
  when<R>(cb: (s: T) => R): Stub<T, R> {
    let expectedArgs: any[] | undefined;
    let expectedProperty: string;

    const p = new Proxy({}, {
      get: (target, property: string) => {
        expectedProperty = property;

        return (...args: any[]) => {
          expectedArgs = args;
        };
      }
    });

    cb(p as T);

    return {
      returns: (r: R) => {
        this.expectations.set(expectedProperty, [
          ...(this.expectations.get(expectedProperty) || []),
          expectedArgs
            ? new CallExpectation(expectedArgs, r)
            : new PropertyExpectation(r)
        ]);
      }
    };
  }

  get object(): T {
    return new Proxy({}, {
      get: (target, property: string) => {
        const expectationsForProperty = this.expectations.get(property);

        if (!expectationsForProperty) {
          throw new Error(`${property} not expected to be called`);
        }

        // TODO: this only checks the first expectation
        // TODO: cleaner check for property vs call expectations
        if (!expectationsForProperty[0].args) {
          expectationsForProperty[0].met = true;

          return expectationsForProperty[0].r;
        }

        return (...args: any[]) => {
          // Find the first unmet expectation.
          const expectation = expectationsForProperty.find(
            // TODO: is isDeepStrictEqual correct here?
            e => e.args!.every((arg, i) => isDeepStrictEqual(args[i], arg))
          );

          if (expectation && expectation.args!.length === args.length) {
            expectation.met = true;

            return expectation.r;
          }

          throw new Error(`${property} not expected to be called with ${inspect(args)}!

Existing expectations:
${expectationsForProperty.join(' or ')}`);
        };
      }
    }) as T;
  }

  verifyAll() {
    this.expectations.forEach((es, p) => {
      es.forEach(e => {
        if (!e.met) {
          if (e.args) {
            throw new Error(`Expected ${p} to be called with ${e}`);
          } else {
            throw new Error(`Expected ${p} to be accessed ${e}`);
          }
        }
      });
    });
  }

  reset() {
    this.expectations.clear();
  }
}
