import Jimp from 'jimp';
import pixelmatch from 'pixelmatch';
import PNGDiffer, { DiffResult } from '../interfaces/png-differ';

export interface Color {
  r: number;
  g: number;
  b: number;
}

export interface PixelDifferOptions {
  /**
   * The color used to mark different pixels.
   */
  diffColor?: Color;

  /**
   * A number between `0` and `1` representing the max difference in %
   * between 2 pixels to be considered identical.
   *
   * @example
   * `0` means the pixel need to be identical.
   *
   * @example
   * `1` means two completely different images will be identical. If the
   * images have different dimension then the comparison will fail.
   *
   * @example
   * `0.1` means black (`#000`) and 90% gray (`#0a0a0a`) will be identical.
   */
  threshold?: number;
}

/**
 * Compare screenshots pixel by pixel using
 * [pixelmatch](https://github.com/mapbox/pixelmatch).
 *
 * Images with different dimensions will always fail comparison and a diff
 * indicating the extra region will be returned. The images will be overlaid
 * starting from the top left corner and then compared. All of the pixels that
 * are outside of the intersection will be considered different, no matter the
 * {@link PixelDifferOptions.threshold | threshold}.
 *
 * ![pixel-differ-explanation](media://pixel-differ-explanation.png)
 *
 * See the examples below to understand how images with different sizes will be
 * compared.
 *
 * ![pixel-differ-examples](media://pixel-differ-examples.png)
 */
export default class PixelDiffer implements PNGDiffer {
  private readonly diffColor: Color;

  private readonly threshold: number;

  /**
   * @param __namedParameters {@link PixelDifferOptions}
   */
  constructor({
    diffColor = { r: 255, g: 0, b: 0 },
    threshold = 0,
  }: PixelDifferOptions = {}) {
    this.diffColor = diffColor;
    this.threshold = threshold;
  }

  compare = async (expected: Buffer, actual: Buffer): Promise<DiffResult> => {
    const expectedJimp = await Jimp.read(expected);
    const actualJimp = await Jimp.read(actual);

    const expectedWidth = expectedJimp.getWidth();
    const actualWidth = actualJimp.getWidth();
    const expectedHeight = expectedJimp.getHeight();
    const actualHeight = actualJimp.getHeight();

    const smallestWidth = Math.min(expectedWidth, actualWidth);
    const smallestHeight = Math.min(expectedHeight, actualHeight);
    const biggestWidth = Math.max(expectedWidth, actualWidth);
    const biggestHeight = Math.max(expectedHeight, actualHeight);

    const allThePixels =
      expectedWidth * expectedHeight +
      actualWidth * actualHeight -
      smallestWidth * smallestHeight;

    const differentSize =
      expectedWidth !== actualWidth || expectedHeight !== actualHeight;

    if (differentSize) {
      expectedJimp.crop(0, 0, smallestWidth, smallestHeight);
      actualJimp.crop(0, 0, smallestWidth, smallestHeight);
    }

    const diffJimp = new Jimp(smallestWidth, smallestHeight, 0xffffffff);

    const numDiffPixels = pixelmatch(
      expectedJimp.bitmap.data,
      actualJimp.bitmap.data,
      diffJimp.bitmap.data, // this will be modified in place
      smallestWidth,
      smallestHeight,
      {
        diffColor: [this.diffColor.r, this.diffColor.g, this.diffColor.b],
        threshold: this.threshold,
        alpha: 0,
      }
    );

    const matches = numDiffPixels === 0;

    const percentage =
      ((numDiffPixels + allThePixels - smallestWidth * smallestHeight) /
        allThePixels) *
      100;

    if (differentSize) {
      // Start by coloring the rectangle containing both images with the diff color.
      const wholeDiffJimp = new Jimp(
        biggestWidth,
        biggestHeight,
        Jimp.rgbaToInt(
          this.diffColor.r,
          this.diffColor.g,
          this.diffColor.b,
          0xff
        )
      );

      // If one image doesn't fully contain the other then there's an area that
      // doesn't belong to either and we need to color it white.
      if (
        !(
          (expectedWidth < actualWidth && expectedHeight < actualHeight) ||
          (actualWidth < expectedWidth && actualHeight < expectedHeight)
        )
      ) {
        await wholeDiffJimp.composite(
          new Jimp(
            biggestWidth - smallestWidth,
            biggestHeight - smallestHeight,
            '#ffffff'
          ),
          biggestWidth !== smallestWidth ? smallestWidth : 0,
          biggestHeight !== smallestHeight ? smallestHeight : 0
        );
      }

      // Diff the intersecting area.
      await wholeDiffJimp.composite(diffJimp, 0, 0);

      return {
        matches: false,
        diff: await wholeDiffJimp.getBufferAsync(Jimp.MIME_PNG),
        percentage,
      };
    }

    if (matches) {
      return { matches: true };
    }

    return {
      matches: false,
      diff: await diffJimp.getBufferAsync(Jimp.MIME_PNG),
      percentage,
    };
  };
}
