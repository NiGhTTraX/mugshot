import PNGDiffer, { DiffResult } from '../interfaces/png-differ';
import pixelmatch, { Color } from '../vendor/pixelmatch';
import CustomJimp from '../vendor/custom-jimp';

interface PixelDifferOptions {
  diffColor?: Color;
  threshold?: number;
}

export default class PixelDiffer implements PNGDiffer {
  private readonly diffColor: Color;

  private readonly threshold: number;

  constructor({
    diffColor = { r: 255, g: 0, b: 0 },
    threshold = 0
  }: PixelDifferOptions = {}) {
    this.diffColor = diffColor;
    this.threshold = threshold;
  }

  compare = async (expected: Buffer, actual: Buffer): Promise<DiffResult> => {
    const expectedJimp = await CustomJimp.read(expected);
    const actualJimp = await CustomJimp.read(actual);

    const smallestWidth = Math.min(expectedJimp.getWidth(), actualJimp.getWidth());
    const smallestHeight = Math.min(expectedJimp.getHeight(), actualJimp.getHeight());
    const biggestWidth = Math.max(expectedJimp.getWidth(), actualJimp.getWidth());
    const biggestHeight = Math.max(expectedJimp.getHeight(), actualJimp.getHeight());

    const differentSize = expectedJimp.getWidth() !== actualJimp.getWidth()
      || expectedJimp.getHeight() !== actualJimp.getHeight();

    if (differentSize) {
      expectedJimp.crop(0, 0, smallestWidth, smallestHeight);
      actualJimp.crop(0, 0, smallestWidth, smallestHeight);
    }

    const diffJimp = new CustomJimp(smallestWidth, smallestHeight, 0xffffffff);

    const numDiffPixels = pixelmatch(
      expectedJimp.bitmap.data,
      actualJimp.bitmap.data,
      diffJimp.bitmap.data, // this will be modified
      smallestWidth,
      smallestHeight,
      // TODO: set threshold to 0
      {
        diffColor: this.diffColor,
        threshold: this.threshold
      }
    );

    const matches = numDiffPixels === 0;

    if (differentSize) {
      const wholeDiffJimp = new CustomJimp(biggestWidth, biggestHeight, '#ff0000');
      await wholeDiffJimp.composite(diffJimp, 0, 0);

      return {
        matches: false,
        diff: await wholeDiffJimp.getBufferAsync(CustomJimp.MIME_PNG)
      };
    }

    if (matches) {
      return { matches: true };
    }

    return {
      matches: false,
      diff: await diffJimp.getBufferAsync(CustomJimp.MIME_PNG)
    };
  }
}
