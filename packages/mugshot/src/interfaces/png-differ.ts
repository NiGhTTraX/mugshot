/* eslint-disable semi */
export type DiffResult = {
  matches: true
} | {
  matches: false;
  /**
   * A PNG MIME encoded buffer of the diff image.
   */
  diff: Buffer;
};

export default interface PNGDiffer {
  /**
   * Compare two PNG MIME encoded buffers.
   */
  compare: (base: Buffer, screenshot: Buffer) => Promise<DiffResult>;
}
