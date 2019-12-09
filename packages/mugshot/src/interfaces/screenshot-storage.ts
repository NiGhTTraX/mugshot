/**
 * A way to read and write screenshots.
 *
 * It's up to the implementation to decide where and how to
 * write the screenshots. All the methods receive the name of
 * the screenshot which is the same value as the name passed
 * in [[Mugshot.check]].
 *
 * @see [[Mugshot.check]]
 */
export default interface ScreenshotStorage {
  /**
   * Return the screenshot for `name` as a PNG encoded buffer.
   *
   * @param name The value passed to [[Mugshot.check]].
   */
  read: (name: string) => Promise<Buffer>;

  /**
   * Check whether a screenshot exists for `namme`.
   *
   * @param name The value passed to [[Mugshot.check]].
   */
  exists: (name: string) => Promise<boolean>;

  /**
   * Write a screenshot for `name`.
   *
   * @param name The value passed to [[Mugshot.check]].
   * @param data PNG encoded Buffer.
   */
  write: (name: string, data: Buffer) => Promise<void>;

  /**
   * Delete the screenshot for `name`.
   *
   * If the screenshot doesn't exist, this should be a no-op.
   *
   * @param name The value passed to [[Mugshot.check]].
   */
  delete: (name: string) => Promise<void>;
}
