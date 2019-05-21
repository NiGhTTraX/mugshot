import PNGProcessor from '../interfaces/png-processor';
import CustomJimp from '../vendor/custom-jimp';

export default class JimpProcessor implements PNGProcessor {
  crop = async (img: Buffer, x: number, y: number, w: number, h: number) => {
    const j = await CustomJimp.read(img);
    const cropped = j.crop(x, y, w, h);

    return cropped.getBufferAsync(CustomJimp.MIME_PNG);
  }
}
