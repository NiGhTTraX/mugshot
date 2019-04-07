import { describe, expect, it } from '../suite';
import jimpEditor from '../../../src/jimp-editor';
import { blackPixelBuffer, whitePixelBuffer } from '../fixtures';

describe('jimpEditor', () => {
  it('should compare identical buffers', async () => {
    expect(await jimpEditor.compare(
      blackPixelBuffer,
      blackPixelBuffer
    )).to.be.true;
  });

  it('should compare different buffers', async () => {
    expect(await jimpEditor.compare(
      blackPixelBuffer,
      whitePixelBuffer
    )).to.be.false;
  });
});
