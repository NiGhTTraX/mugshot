/* eslint-disable semi */
export default interface PNGProcessor {
  /**
   * Crop a screenshot to the specified dimensions.
   *
   * @param img PNG encoded buffer.
   * @param x Top left coordinate in pixels.
   * @param y Top left coordinate in pixels.
   * @param w Width in pixels.
   * @param h Height in pixels.
   */
  crop: (
    img: Buffer,
    x: number,
    y: number,
    w: number,
    h: number
  ) => Promise<Buffer>;

  /**
   * Draw a colored rectangle over the screenshot.
   *
   * @param img PNG encoded buffer.
   * @param x Top left coordinate in pixels.
   * @param y Top left coordinate in pixels.
   * @param w Width in pixels.
   * @param h Height in pixels.
   * @param c Hex color e.g. `#ff00ff`.
   */
  paint: (
    img: Buffer,
    x: number,
    y: number,
    w: number,
    h: number,
    c: string
  ) => Promise<Buffer>;
}
