import { describe, expect, it } from '../../../../../../tests/node/suite';
import jimpDiffer from '../../../../src/lib/jimp-differ';
import { blackPixelBuffer, blackWhiteDiffBuffer, whitePixelBuffer } from '../../../../../../tests/node/fixtures';

describe('jimpDiffer', () => {
  it('should compare identical buffers', async () => {
    const result = await jimpDiffer.compare(
      blackPixelBuffer,
      blackPixelBuffer
    );

    expect(result.matches).to.be.true;
  });

  it('should not create a diff for identical buffers', async () => {
    const result = await jimpDiffer.compare(
      blackPixelBuffer,
      blackPixelBuffer
    );

    // @ts-ignore
    expect(result.diff).to.be.undefined;
  });

  it('should compare different buffers', async () => {
    const result = await jimpDiffer.compare(
      blackPixelBuffer,
      whitePixelBuffer
    );

    expect(result.matches).to.be.false;
  });

  it('should create a diff for different buffers', async () => {
    const result = await jimpDiffer.compare(
      blackPixelBuffer,
      whitePixelBuffer
    );

    // @ts-ignore
    expect(result.diff).to.deep.equal(blackWhiteDiffBuffer);
  });
});
