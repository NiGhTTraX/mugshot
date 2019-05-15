import Jimp from 'jimp';
import PNGDiffer from '../interfaces/png-differ';

const jimpDiffer: PNGDiffer = {
  compare: async (baseline: Buffer, screenshot: Buffer) => {
    const baselineJimp = await Jimp.read(baseline);
    const screenshotJimp = await Jimp.read(screenshot);

    const result = Jimp.diff(
      baselineJimp,
      screenshotJimp
    );

    const matches = result.percent === 0;

    if (baselineJimp.getWidth() !== screenshotJimp.getWidth()
      || baselineJimp.getHeight() !== screenshotJimp.getHeight()) {
      const biggestWidth = Math.max(baselineJimp.getWidth(), screenshotJimp.getWidth());
      const biggestHeight = Math.max(baselineJimp.getHeight(), screenshotJimp.getHeight());
      const smallestWidth = Math.min(baselineJimp.getWidth(), screenshotJimp.getWidth());
      const smallestHeight = Math.min(baselineJimp.getHeight(), screenshotJimp.getHeight());

      let sameRegionDiff: Jimp;
      if (matches) {
        sameRegionDiff = new Jimp(smallestWidth, smallestHeight, '#ffffff');
      } else {
        sameRegionDiff = result.image;
      }

      const diff = new Jimp(biggestWidth, biggestHeight, '#ff0000');
      await diff.composite(sameRegionDiff, 0, 0);

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
