import jimp from 'jimp';

export interface PNGEditor {
  compare: (base: Buffer, screenshot: Buffer) => Promise<boolean>;
}

export default class JimpEditor implements PNGEditor {
  compare = async (base: Buffer, screenshot: Buffer) => jimp.diff(
    await jimp.read(base),
    await jimp.read(screenshot)
  ).percent === 0
}
