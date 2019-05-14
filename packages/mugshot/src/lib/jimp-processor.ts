import jimp from 'jimp';
import PNGProcessor from '../interfaces/png-processor';

export default class JimpProcessor implements PNGProcessor {
  crop = async (img: Buffer, x: number, y: number, w: number, h: number) => {
    const j = await jimp.read(img);
    const cropped = j.crop(x, y, w, h);

    return cropped.getBufferAsync(jimp.MIME_PNG);
  }
}
