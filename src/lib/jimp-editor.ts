import jimp from 'jimp';
import PNGEditor from '../interfaces/png-editor';

const jimpEditor: PNGEditor = {
  compare: async (base: Buffer, screenshot: Buffer) => jimp.diff(
    await jimp.read(base),
    await jimp.read(screenshot)
  ).percent === 0
};

export default jimpEditor;
