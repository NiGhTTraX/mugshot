import { expectIdenticalBuffers, describe, expect, it } from '../../../../../../tests/node/suite';
import PixelDiffer from '../../../../src/lib/pixel-differ';
import {
  blackSquare100x100Buffer,
  blackSquare100x50Buffer,
  blackSquare50x100Buffer,
  blackSquare50x50Buffer, blueSquare50x50Buffer,
  diffBlackSquare100x100BlackSquare100x50Buffer,
  diffBlackSquare100x100BlackSquare50x100Buffer,
  diffBlackSquare100x100BlackSquare50x50Buffer,
  redSquare100x100Buffer, redSquare50x50Buffer,
  whiteSquare100x100Buffer
} from '../../../../../../tests/node/fixtures';

describe('PixelDiffer', () => {
  describe('same width and height', () => {
    it('should compare identical buffers', async () => {
      const result = await new PixelDiffer().compare(
        blackSquare100x100Buffer,
        blackSquare100x100Buffer
      );

      expect(result.matches).to.be.true;
    });

    it('should not create a diff for identical buffers', async () => {
      const result = await new PixelDiffer().compare(
        blackSquare100x100Buffer,
        blackSquare100x100Buffer
      );

      // @ts-ignore
      expect(result.diff).to.be.undefined;
    });

    it('should compare different buffers', async () => {
      const result = await new PixelDiffer().compare(
        blackSquare100x100Buffer,
        whiteSquare100x100Buffer
      );

      expect(result.matches).to.be.false;
    });

    it('should create a diff for different buffers', async () => {
      const result = await new PixelDiffer().compare(
        blackSquare100x100Buffer,
        whiteSquare100x100Buffer
      );

      await expectIdenticalBuffers(
        // @ts-ignore because `.diff` is only present if we narrow by `.matches === false`
        result.diff,
        redSquare100x100Buffer
      );
    });
  });

  // The target buffer is a subregion of the source buffer.
  describe('different sizes and same content', () => {
    it('with different width and height should create a diff', async () => {
      const result = await new PixelDiffer().compare(
        blackSquare100x100Buffer,
        blackSquare50x50Buffer
      );

      expect(result.matches).to.be.false;
      await expectIdenticalBuffers(
        // @ts-ignore
        result.diff,
        diffBlackSquare100x100BlackSquare50x50Buffer
      );
    });

    it('with different width should create a diff', async () => {
      const result = await new PixelDiffer().compare(
        blackSquare100x100Buffer,
        blackSquare50x100Buffer
      );

      expect(result.matches).to.be.false;
      await expectIdenticalBuffers(
        // @ts-ignore
        result.diff,
        diffBlackSquare100x100BlackSquare50x100Buffer
      );
    });

    it('with different height should create a diff', async () => {
      const result = await new PixelDiffer().compare(
        blackSquare100x100Buffer,
        blackSquare100x50Buffer
      );

      expect(result.matches).to.be.false;
      await expectIdenticalBuffers(
        // @ts-ignore
        result.diff,
        diffBlackSquare100x100BlackSquare100x50Buffer
      );
    });
  });

  describe('different sizes and different content', () => {
    it('with different width and height should create a diff', async () => {
      const result = await new PixelDiffer().compare(
        whiteSquare100x100Buffer,
        blackSquare50x50Buffer
      );

      expect(result.matches).to.be.false;
      await expectIdenticalBuffers(
        // @ts-ignore
        result.diff,
        redSquare100x100Buffer
      );
    });

    it('with different width should create a diff', async () => {
      const result = await new PixelDiffer().compare(
        whiteSquare100x100Buffer,
        blackSquare50x100Buffer
      );

      expect(result.matches).to.be.false;
      await expectIdenticalBuffers(
        // @ts-ignore
        result.diff,
        redSquare100x100Buffer
      );
    });

    it('with different height should create a diff', async () => {
      const result = await new PixelDiffer().compare(
        whiteSquare100x100Buffer,
        blackSquare100x50Buffer
      );

      expect(result.matches).to.be.false;
      await expectIdenticalBuffers(
        // @ts-ignore
        result.diff,
        redSquare100x100Buffer
      );
    });
  });

  describe('config', () => {
    it('should apply custom diff color', async () => {
      const result = await new PixelDiffer({ diffColor: { r: 0, g: 0, b: 255 } }).compare(
        blackSquare50x50Buffer,
        redSquare50x50Buffer
      );

      await expectIdenticalBuffers(
        // @ts-ignore because `.diff` is only present if we narrow by `.matches === false`
        result.diff,
        blueSquare50x50Buffer
      );
    });
  });
});
