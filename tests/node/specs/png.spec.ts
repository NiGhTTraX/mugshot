import path from 'path';
import fs from 'fs-extra';
import { describe, expect, it } from '../suite';
import JimpEditor from '../../../src/jimp-editor';

describe('JimpEditor', () => {
  it('should compare identical buffers', async () => {
    const buffer = await fs.readFile(
      path.join(__dirname, '../../gui/fixtures/simple.png')
    );

    const editor = new JimpEditor();

    expect(await editor.compare(
      buffer,
      buffer
    )).to.be.true;
  });

  it('should compare different buffers', async () => {
    const buffer1 = await fs.readFile(
      path.join(__dirname, '../../gui/fixtures/simple.png')
    );

    const buffer2 = await fs.readFile(
      path.join(__dirname, '../../gui/fixtures/simple2.png')
    );

    const editor = new JimpEditor();

    expect(await editor.compare(
      buffer1,
      buffer2
    )).to.be.false;
  });
});
