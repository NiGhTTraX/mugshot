export interface PNGProcessor {
  /**
   * Crop a screenshot to the specified dimensions.
   *
   * Will throw {@link OutOfBoundsError} if trying to crop outside of the image.
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

export class OutOfBoundsError extends Error {
  constructor(
    x1: number,
    y1: number,
    w1: number,
    h1: number,
    w2: number,
    h2: number
  ) {
    super(
      `Tried to crop (${x1},${y1},${w1},${h1}) outside of the image (${w2},${h2})`
    );
  }
}
