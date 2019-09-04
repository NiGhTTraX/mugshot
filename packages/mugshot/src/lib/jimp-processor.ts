import Jimp from 'jimp';
import PNGProcessor from '../interfaces/png-processor';

export default class JimpProcessor implements PNGProcessor {
  crop = async (img: Buffer, x: number, y: number, w: number, h: number) => {
    const j = await Jimp.read(img);

    await j.crop(x, y, w, h);

    return j.getBufferAsync(Jimp.MIME_PNG);
  };

  paint = async (img: Buffer, x: number, y: number, w: number, h: number, c: string) => {
    const j = await Jimp.read(img);
    const colorSquare = new Jimp(w, h, c);

    await j.composite(colorSquare, x, y);

    return j.getBufferAsync(Jimp.MIME_PNG);
  };
}
