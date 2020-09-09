import { expect } from 'tdd-buffet/expect/chai';
import { describe, it } from 'tdd-buffet/suite/node';
import {
  createTestBuffer,
  expectIdenticalBuffers,
  lightenBuffer,
} from '../helpers';
import PixelDiffer from '../../../src/lib/pixel-differ';

describe('PixelDiffer', () => {
  describe('same width and height', () => {
    it('should compare identical buffers', async () => {
      const result = await new PixelDiffer().compare(
        await createTestBuffer(['RGB', 'RGB', 'RGB']),
        await createTestBuffer(['RGB', 'RGB', 'RGB'])
      );

      expect(result.matches).to.be.true;
    });

    it('should not create a diff for identical buffers', async () => {
      const result = await new PixelDiffer().compare(
        await createTestBuffer(['RGB', 'RGB', 'RGB']),
        await createTestBuffer(['RGB', 'RGB', 'RGB'])
      );

      expect(
        // @ts-expect-error because we don't discriminate the result
        result.diff
      ).to.be.undefined;
    });

    it('should not return the diff in percentage', async () => {
      const result = await new PixelDiffer().compare(
        await createTestBuffer(['RGB', 'RGB', 'RGB']),
        await createTestBuffer(['RGB', 'RGB', 'RGB'])
      );

      expect(
        // @ts-expect-error because we don't discriminate the result
        result.percentage
      ).to.be.undefined;
    });

    it('should compare different buffers', async () => {
      const result = await new PixelDiffer().compare(
        await createTestBuffer(['RRR', 'GGG', 'BBB']),
        await createTestBuffer(['GGG', 'BBB', 'RRR'])
      );

      expect(result.matches).to.be.false;
    });

    it('should create a diff for different buffers', async () => {
      const result = await new PixelDiffer().compare(
        await createTestBuffer(['GGG', 'GGG', 'GGG']),
        await createTestBuffer(['BBB', 'BBB', 'BBB'])
      );

      await expectIdenticalBuffers(
        // @ts-expect-error because we don't discriminate the result
        result.diff,
        await createTestBuffer(['RRR', 'RRR', 'RRR'])
      );
    });

    it('should return the diff in percentage', async () => {
      const baseline = await createTestBuffer(['GGG', 'GGG']);
      const tests: [[string, ...string[]], number][] = [
        [['BGG', 'GGG'], 16.67],
        [['BBG', 'GGG'], 33.33],
        [['BBB', 'GGG'], 50],
        [['BBB', 'BGG'], 66.67],
        [['BBB', 'BBG'], 83.34],
        [['BBB', 'BBB'], 100],
      ];

      // eslint-disable-next-line no-restricted-syntax
      for (const [test, result] of tests) {
        // eslint-disable-next-line no-await-in-loop
        const screenshot = await createTestBuffer(test);

        const {
          // @ts-expect-error because we don't discriminate the result
          percentage,
          // eslint-disable-next-line no-await-in-loop
        } = await new PixelDiffer().compare(baseline, screenshot);

        expect(percentage).to.be.closeTo(result, 0.01);
      }
    });

    it('should have 0 threshold by default', async () => {
      const result = await new PixelDiffer().compare(
        await createTestBuffer(['KKK', 'KKK']),
        await lightenBuffer(await createTestBuffer(['KKK', 'KKK']), 1)
      );

      expect(result.matches).to.be.false;
    });
  });

  // The target buffer is a subregion of the source buffer.
  describe('different sizes and same content', () => {
    it('with different width and height should create a diff', async () => {
      const result = await new PixelDiffer().compare(
        await createTestBuffer(['KKKK', 'KKKK']),
        await createTestBuffer(['KK', 'KK', 'KK', 'KK'])
      );

      expect(result.matches).to.be.false;
      await expectIdenticalBuffers(
        // @ts-expect-error because we don't discriminate the result
        result.diff,
        await createTestBuffer(['  RR', '  RR', 'RR  ', 'RR  '])
      );
    });

    it('with different width should create a diff', async () => {
      const result = await new PixelDiffer().compare(
        await createTestBuffer(['KKK', 'KKK', 'KKK']),
        await createTestBuffer(['KK', 'KK', 'KK'])
      );

      expect(result.matches).to.be.false;
      await expectIdenticalBuffers(
        // @ts-expect-error because we don't discriminate the result
        result.diff,
        await createTestBuffer(['  R', '  R', '  R'])
      );
    });

    it('with different height should create a diff', async () => {
      const result = await new PixelDiffer().compare(
        await createTestBuffer(['KKK', 'KKK', 'KKK']),
        await createTestBuffer(['KKK', 'KKK'])
      );

      expect(result.matches).to.be.false;
      await expectIdenticalBuffers(
        // @ts-expect-error because we don't discriminate the result
        result.diff,
        await createTestBuffer(['   ', '   ', 'RRR'])
      );
    });

    it('should return the diff in percentage', async () => {
      const baseline = await createTestBuffer(['GGG', 'GGG']);
      const tests: [[string, ...string[]], number][] = [
        [['GGG'], 50],
        [['GGG', 'GGG', 'GGG'], 33.34],
        [['GGG', 'GGG', 'GGG', 'GGG'], 50],
        [['GGG', 'GGG', 'GGG', 'GGG', 'GGG'], 60],
      ];

      // eslint-disable-next-line no-restricted-syntax
      for (const [test, result] of tests) {
        // eslint-disable-next-line no-await-in-loop
        const screenshot = await createTestBuffer(test);

        const {
          // @ts-expect-error because we don't discriminate the result
          percentage,
          // eslint-disable-next-line no-await-in-loop
        } = await new PixelDiffer().compare(baseline, screenshot);

        expect(percentage).to.be.closeTo(result, 0.01);
      }
    });
  });

  describe('different sizes and different content', () => {
    it('with different width and height should create a diff', async () => {
      const result = await new PixelDiffer().compare(
        await createTestBuffer(['BB', 'BB']),
        await createTestBuffer(['GGG', 'GGG', 'GGG'])
      );

      expect(result.matches).to.be.false;
      await expectIdenticalBuffers(
        // @ts-expect-error because we don't discriminate the result
        result.diff,
        await createTestBuffer(['RRR', 'RRR', 'RRR'])
      );
    });

    it('with different width should create a diff', async () => {
      const result = await new PixelDiffer().compare(
        await createTestBuffer(['BBB', 'BBB', 'BBB']),
        await createTestBuffer(['GG', 'GG', 'GG'])
      );

      expect(result.matches).to.be.false;
      await expectIdenticalBuffers(
        // @ts-expect-error because we don't discriminate the result
        result.diff,
        await createTestBuffer(['RRR', 'RRR', 'RRR'])
      );
    });

    it('with different height should create a diff', async () => {
      const result = await new PixelDiffer().compare(
        await createTestBuffer(['BBB', 'BBB', 'BBB']),
        await createTestBuffer(['GGG', 'GGG'])
      );

      expect(result.matches).to.be.false;
      await expectIdenticalBuffers(
        // @ts-expect-error because we don't discriminate the result
        result.diff,
        await createTestBuffer(['RRR', 'RRR', 'RRR'])
      );
    });

    it('should return the diff in percentage', async () => {
      const baseline = await createTestBuffer(['GGG', 'GGG']);
      const tests: [[string, ...string[]], number][] = [
        [['BGG'], 66.67],
        [['BBG'], 83.34],
        [['BBB'], 100],
        [['BBB', 'BBB', 'BBB'], 100],
        [['BBB', 'BBB', 'BBB', 'BBB'], 100],
        [['BBB', 'BBB', 'BBB', 'BBB', 'BBB'], 100],
      ];

      // eslint-disable-next-line no-restricted-syntax
      for (const [test, result] of tests) {
        // eslint-disable-next-line no-await-in-loop
        const screenshot = await createTestBuffer(test);

        const {
          // @ts-expect-error because we don't discriminate the result
          percentage,
          // eslint-disable-next-line no-await-in-loop
        } = await new PixelDiffer().compare(baseline, screenshot);

        expect(percentage).to.be.closeTo(result, 0.01);
      }
    });
  });

  describe('config', () => {
    it('should apply custom diff color', async () => {
      const result = await new PixelDiffer({
        diffColor: { r: 0, g: 0, b: 255 },
      }).compare(
        await createTestBuffer(['RRR', 'RRR']),
        await createTestBuffer(['GGG', 'GGG'])
      );

      await expectIdenticalBuffers(
        // @ts-expect-error because we don't discriminate the result
        result.diff,
        await createTestBuffer(['BBB', 'BBB'])
      );
    });

    it('should apply custom threshold', async () => {
      const result = await new PixelDiffer({ threshold: 0.1 }).compare(
        await createTestBuffer(['KKK', 'KKK']),
        await lightenBuffer(await createTestBuffer(['KKK', 'KKK']), 10)
      );

      expect(result.matches).to.be.true;
    });
  });
});
