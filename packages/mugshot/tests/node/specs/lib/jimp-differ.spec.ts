import { compareBuffers, describe, expect, it } from '../../../../../../tests/node/suite';
import jimpDiffer from '../../../../src/lib/jimp-differ';
import {
  blackPixelBuffer,
  blackSquare100x100Buffer,
  blackSquare100x50Buffer,
  blackSquare50x100Buffer,
  blackSquare50x50Buffer, diffBlackSquare100x100BlackSquare100x50Buffer,
  diffBlackSquare100x100BlackSquare50x100Buffer,
  diffBlackSquare100x100BlackSquare50x50Buffer,
  redPixelBuffer, redSquare100x100Buffer,
  whitePixelBuffer,
  whiteSquare100x100Buffer
} from '../../../../../../tests/node/fixtures';

describe('JimpDiffer', () => {
  describe('same width and height', () => {
    it('should compare identical buffers', async () => {
      const result = await jimpDiffer.compare(
        blackSquare100x100Buffer,
        blackSquare100x100Buffer
      );

      expect(result.matches).to.be.true;
    });

    it('should not create a diff for identical buffers', async () => {
      const result = await jimpDiffer.compare(
        blackSquare100x100Buffer,
        blackSquare100x100Buffer
      );

      // @ts-ignore
      expect(result.diff).to.be.undefined;
    });

    it('should compare different buffers', async () => {
      const result = await jimpDiffer.compare(
        blackSquare100x100Buffer,
        whiteSquare100x100Buffer
      );

      expect(result.matches).to.be.false;
    });

    it('should create a diff for different buffers', async () => {
      // TODO: we're comparing single pixels here so we can compare the raw buffer result;
      // should we compare squares and do a diff on the result instead? inception expectation?
      const result = await jimpDiffer.compare(
        blackPixelBuffer,
        whitePixelBuffer
      );

      // @ts-ignore because `.diff` is only present if we narrow by `.matches === false`
      expect(result.diff).to.deep.equal(redPixelBuffer);
    });
  });

  // The target buffer is a subregion of the source buffer.
  describe('different sizes and same content', () => {
    it('with different width and height should create a diff', async () => {
      const result = await jimpDiffer.compare(
        blackSquare100x100Buffer,
        blackSquare50x50Buffer
      );

      expect(result.matches).to.be.false;
      await compareBuffers(
        // @ts-ignore
        result.diff,
        diffBlackSquare100x100BlackSquare50x50Buffer
      );
    });

    it('with different width should create a diff', async () => {
      const result = await jimpDiffer.compare(
        blackSquare100x100Buffer,
        blackSquare50x100Buffer
      );

      expect(result.matches).to.be.false;
      await compareBuffers(
        // @ts-ignore
        result.diff,
        diffBlackSquare100x100BlackSquare50x100Buffer
      );
    });

    it('with different height should create a diff', async () => {
      const result = await jimpDiffer.compare(
        blackSquare100x100Buffer,
        blackSquare100x50Buffer
      );

      expect(result.matches).to.be.false;
      await compareBuffers(
        // @ts-ignore
        result.diff,
        diffBlackSquare100x100BlackSquare100x50Buffer
      );
    });
  });

  describe('different sizes and different content', () => {
    it('with different width and height should create a diff', async () => {
      const result = await jimpDiffer.compare(
        whiteSquare100x100Buffer,
        blackSquare50x50Buffer
      );

      expect(result.matches).to.be.false;
      await compareBuffers(
        // @ts-ignore
        result.diff,
        redSquare100x100Buffer
      );
    });

    it('with different width should create a diff', async () => {
      const result = await jimpDiffer.compare(
        whiteSquare100x100Buffer,
        blackSquare50x100Buffer
      );

      expect(result.matches).to.be.false;
      await compareBuffers(
        // @ts-ignore
        result.diff,
        redSquare100x100Buffer
      );
    });

    it('with different height should create a diff', async () => {
      const result = await jimpDiffer.compare(
        whiteSquare100x100Buffer,
        blackSquare100x50Buffer
      );

      expect(result.matches).to.be.false;
      await compareBuffers(
        // @ts-ignore
        result.diff,
        redSquare100x100Buffer
      );
    });
  });
});
