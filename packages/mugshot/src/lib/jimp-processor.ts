import { Jimp } from '@mugshot/jimp';
import { PNGProcessor, OutOfBoundsError } from '../interfaces/png-processor';

/**
 * Process screenshots using [Jimp](https://github.com/oliver-moran/jimp).
 */
export class JimpProcessor implements PNGProcessor {
  crop = async (img: Buffer, x: number, y: number, w: number, h: number) => {
    const j = await Jimp.read(img);

    JimpProcessor.checkBounds(x, y, w, h, j.getWidth(), j.getHeight());

    await j.crop(x, y, w, h);

    return j.getBufferAsync(Jimp.MIME_PNG);
  };

  paint = async (
    img: Buffer,
    x: number,
    y: number,
    w: number,
    h: number,
    c: string
  ) => {
    const j = await Jimp.read(img);

    JimpProcessor.checkBounds(x, y, w, h, j.getWidth(), j.getHeight());

    const colorSquare = new Jimp(w, h, c);

    await j.composite(colorSquare, x, y);

    return j.getBufferAsync(Jimp.MIME_PNG);
  };

  private static checkBounds(
    x: number,
    y: number,
    w: number,
    h: number,
    imgWidth: number,
    imgHeight: number
  ) {
    if (x < 0 || y < 0 || w > imgWidth || h > imgHeight) {
      throw new OutOfBoundsError(x, y, w, h, imgWidth, imgHeight);
    }
  }
}
