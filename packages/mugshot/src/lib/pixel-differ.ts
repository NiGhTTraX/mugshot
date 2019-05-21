import PNGDiffer from '../interfaces/png-differ';
import pixelmatch from './pixelmatch';
import CustomJimp from './custom-jimp';

const pixelDiffer: PNGDiffer = {
  compare: async (baseline: Buffer, screenshot: Buffer) => {
    const baselineJimp = await CustomJimp.read(baseline);
    const screenshotJimp = await CustomJimp.read(screenshot);

    const smallestWidth = Math.min(baselineJimp.getWidth(), screenshotJimp.getWidth());
    const smallestHeight = Math.min(baselineJimp.getHeight(), screenshotJimp.getHeight());
    const biggestWidth = Math.max(baselineJimp.getWidth(), screenshotJimp.getWidth());
    const biggestHeight = Math.max(baselineJimp.getHeight(), screenshotJimp.getHeight());

    const differentSize = baselineJimp.getWidth() !== screenshotJimp.getWidth()
      || baselineJimp.getHeight() !== screenshotJimp.getHeight();

    if (differentSize) {
      baselineJimp.crop(0, 0, smallestWidth, smallestHeight);
      screenshotJimp.crop(0, 0, smallestWidth, smallestHeight);
    }

    const diff = new CustomJimp(smallestWidth, smallestHeight, 0xffffffff);

    const numDiffPixels = pixelmatch(
      baselineJimp.bitmap.data,
      screenshotJimp.bitmap.data,
      diff.bitmap.data, // this will be modified
      smallestWidth,
      smallestHeight
    );

    const matches = numDiffPixels === 0;

    if (differentSize) {
      const wholeDiff = new CustomJimp(biggestWidth, biggestHeight, '#ff0000');
      await wholeDiff.composite(diff, 0, 0);

      return {
        matches: false,
        diff: await wholeDiff.getBufferAsync(CustomJimp.MIME_PNG)
      };
    }

    if (matches) {
      return { matches: true };
    }

    return {
      matches: false,
      diff: await diff.getBufferAsync(CustomJimp.MIME_PNG)
    };
  }
};

export default pixelDiffer;
