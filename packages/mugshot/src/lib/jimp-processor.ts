import PNGProcessor from '../interfaces/png-processor';
import CustomJimp from '../vendor/custom-jimp';

export default class JimpProcessor implements PNGProcessor {
  crop = async (img: Buffer, x: number, y: number, w: number, h: number) => {
    const j = await CustomJimp.read(img);

    await j.crop(x, y, w, h);

    return j.getBufferAsync(CustomJimp.MIME_PNG);
  };

  setColor = async (img: Buffer, x: number, y: number, w: number, h: number, c: string) => {
    const j = await CustomJimp.read(img);
    const colorSquare = new CustomJimp(w, h, c);

    await j.composite(colorSquare, x, y);

    return j.getBufferAsync(CustomJimp.MIME_PNG);
  };
}
