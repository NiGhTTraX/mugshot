import jimp from 'jimp';
import PNGDiffer from '../interfaces/png-differ';

const jimpDiffer: PNGDiffer = {
  compare: async (base: Buffer, screenshot: Buffer) => {
    const result = jimp.diff(
      await jimp.read(base),
      await jimp.read(screenshot)
    );

    const matches = result.percent === 0;

    if (matches) {
      return { matches: true };
    }

    return {
      matches: false,
      diff: await result.image.getBufferAsync(jimp.MIME_PNG)
    };
  }
};

export default jimpDiffer;
