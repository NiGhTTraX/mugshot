import { describe, expect, it } from '../../suite';
import jimpEditor from '../../../../src/lib/jimp-editor';
import { blackPixelBuffer, blackWhiteDiffBuffer, whitePixelBuffer } from '../../fixtures';

describe('jimpEditor', () => {
  it('should compare identical buffers', async () => {
    const result = await jimpEditor.compare(
      blackPixelBuffer,
      blackPixelBuffer
    );

    expect(result.matches).to.be.true;
  });

  it('should not create a diff for identical buffers', async () => {
    const result = await jimpEditor.compare(
      blackPixelBuffer,
      blackPixelBuffer
    );

    // @ts-ignore
    expect(result.diff).to.be.undefined;
  });

  it('should compare different buffers', async () => {
    const result = await jimpEditor.compare(
      blackPixelBuffer,
      whitePixelBuffer
    );

    expect(result.matches).to.be.false;
  });

  it('should create a diff for different buffers', async () => {
    const result = await jimpEditor.compare(
      blackPixelBuffer,
      whitePixelBuffer
    );

    // @ts-ignore
    expect(result.diff).to.deep.equal(blackWhiteDiffBuffer);
  });
});
