import Jimp from 'jimp';
import PNGDiffer from '../interfaces/png-differ';

/**
 * Replace the white@90% with white@100% in the Jimp diff image.
 */
function makeJimpDiffWhiter(diffJimp: Jimp) {
  for (let x = 0; x < diffJimp.getWidth(); x++) {
    for (let y = 0; y < diffJimp.getHeight(); y++) {
      const pixelColor = Jimp.intToRGBA(diffJimp.getPixelColor(x, y));

      if (pixelColor.a === 255
          && pixelColor.r === pixelColor.g
          && pixelColor.g === pixelColor.b
          && pixelColor.b === 229
      ) {
        diffJimp.setPixelColor(4294967295, x, y);
      }
    }
  }
}

const pixelDiffer: PNGDiffer = {
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

    makeJimpDiffWhiter(result.image);

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

export default pixelDiffer;
