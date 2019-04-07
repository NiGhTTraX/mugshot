import jimp from 'jimp';

export interface PNGEditor {
  compare: (base: Buffer, screenshot: Buffer) => Promise<boolean>;
}

const jimpEditor: PNGEditor = {
  compare: async (base: Buffer, screenshot: Buffer) => jimp.diff(
    await jimp.read(base),
    await jimp.read(screenshot)
  ).percent === 0
};

export default jimpEditor;
