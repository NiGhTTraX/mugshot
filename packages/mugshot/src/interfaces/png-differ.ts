/* eslint-disable semi */
export type DiffResult =
  | {
      matches: true;
    }
  | {
      matches: false;
      /**
       * A PNG MIME encoded buffer of the diff image.
       */
      diff: Buffer;
    };

/**
 * Compare two screenshots and produce a diff image if necessary.
 */
export default interface PNGDiffer {
  /**
   * @param expected PNG encoded buffer.
   * @param actual PNG encoded buffer.
   */
  compare: (expected: Buffer, actual: Buffer) => Promise<DiffResult>;
}
