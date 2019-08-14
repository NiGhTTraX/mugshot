/* eslint-disable semi */
/**
 * A way to read and write baselines.
 *
 * It's up to the implementation to decide where and how to
 * write the baselines. All the methods receive the name of
 * the baseline which is the same value as the name passed
 * in `Mugshot.check()`.
 *
 * @see Mugshot.check
 */
export default interface ScreenshotStorage {
  getBaseline: (name: string) => Promise<Buffer>;

  baselineExists: (name: string) => Promise<boolean>;

  /**
   * @param name
   * @param data PNG encoded Buffer.
   */
  writeBaseline: (name: string, data: Buffer) => Promise<void>;
}
