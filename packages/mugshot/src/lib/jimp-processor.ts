import Jimp from 'jimp';
import { PNGProcessor, OutOfBoundsError } from '../interfaces/png-processor';

/**
 * Process screenshots using [Jimp](https://github.com/oliver-moran/jimp).
 */
export class JimpProcessor implements PNGProcessor {
  crop = async (img: Buffer, x: number, y: number, w: number, h: number) => {
    const j = await Jimp.read(img);

    JimpProcessor.checkBounds(j, x, y, w, h);

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

    JimpProcessor.checkBounds(j, x, y, w, h);

    const colorSquare = new Jimp(w, h, c);

    await j.composite(colorSquare, x, y);

    return j.getBufferAsync(Jimp.MIME_PNG);
  };

  private static checkBounds(
    j: Jimp,
    x: number,
    y: number,
    w: number,
    h: number
  ) {
    if (x < 0 || y < 0 || w > j.getWidth() || h > j.getHeight()) {
      throw new OutOfBoundsError(x, y, w, h, j.getWidth(), j.getHeight());
    }
  }
}
