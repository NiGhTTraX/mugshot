import Jimp from 'jimp';
import PNGDiffer from '../interfaces/png-differ';

const jimpDiffer: PNGDiffer = {
  compare: async (baseline: Buffer, screenshot: Buffer) => {
    const baselineJimp = await Jimp.read(baseline);
    const screenshotJimp = await Jimp.read(screenshot);

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

    const result = Jimp.diff(
      baselineJimp,
      screenshotJimp
    );

    const matches = result.percent === 0;

    if (differentSize) {
      const diff = new Jimp(biggestWidth, biggestHeight, '#ff0000');
      await diff.composite(result.image, 0, 0);

      return {
        matches: false,
        diff: await diff.getBufferAsync(Jimp.MIME_PNG)
      };
    }

    if (matches) {
      return { matches: true };
    }

    return {
      matches: false,
      diff: await result.image.getBufferAsync(Jimp.MIME_PNG)
    };
  }
};

export default jimpDiffer;
