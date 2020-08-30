/* eslint-disable no-restricted-syntax */
import { expect } from 'tdd-buffet/expect/jest';
import { describe, it } from 'tdd-buffet/suite/node';
import { createTestBuffer, expectIdenticalBuffers } from '../helpers';
import { OutOfBoundsError } from '../../../src/interfaces/png-processor';
import JimpProcessor from '../../../src/lib/jimp-processor';

describe('JimpProcessor', () => {
  it('should crop the entire image', async () => {
    const processor = new JimpProcessor();
    const img = await createTestBuffer(['KKKK', 'KKKK', 'KKKK', 'KKKK']);
    const cropped = await processor.crop(img, 0, 0, 4, 4);

    await expectIdenticalBuffers(cropped, img);
  });

  it('should crop a square from the center', async () => {
    const processor = new JimpProcessor();
    const cropped = await processor.crop(
      await createTestBuffer(['    ', ' GG ', ' GG ', '    ']),
      1,
      1,
      2,
      2
    );

    await expectIdenticalBuffers(cropped, await createTestBuffer(['GG', 'GG']));
  });

  it('should crop a square from the top left corner', async () => {
    const processor = new JimpProcessor();
    const cropped = await processor.crop(
      await createTestBuffer(['GG  ', 'GG  ', '    ', '   ']),
      0,
      0,
      2,
      2
    );

    await expectIdenticalBuffers(cropped, await createTestBuffer(['GG', 'GG']));
  });

  it('should crop a square from the top right corner', async () => {
    const processor = new JimpProcessor();
    const cropped = await processor.crop(
      await createTestBuffer(['  GG', '  GG', '    ', '    ']),
      2,
      0,
      2,
      2
    );

    await expectIdenticalBuffers(cropped, await createTestBuffer(['GG', 'GG']));
  });

  it('should crop a square from the bottom left corner', async () => {
    const processor = new JimpProcessor();
    const cropped = await processor.crop(
      await createTestBuffer(['    ', '    ', 'GG  ', 'GG  ']),
      0,
      2,
      2,
      2
    );

    await expectIdenticalBuffers(cropped, await createTestBuffer(['GG', 'GG']));
  });

  it('should crop a square from the bottom right corner', async () => {
    const processor = new JimpProcessor();
    const cropped = await processor.crop(
      await createTestBuffer(['    ', '    ', '  GG', '  GG']),
      2,
      2,
      2,
      2
    );

    await expectIdenticalBuffers(cropped, await createTestBuffer(['GG', 'GG']));
  });

  it('should paint the entire square', async () => {
    const processor = new JimpProcessor();
    const painted = await processor.paint(
      await createTestBuffer(['GG', 'GG']),
      0,
      0,
      2,
      2,
      '#ff0000'
    );

    await expectIdenticalBuffers(painted, await createTestBuffer(['RR', 'RR']));
  });

  it('should paint a full width slice', async () => {
    const processor = new JimpProcessor();
    const painted = await processor.paint(
      await createTestBuffer(['GGG', 'GGG', 'GGG']),
      0,
      0,
      3,
      2,
      '#fff'
    );

    await expectIdenticalBuffers(
      painted,
      await createTestBuffer(['   ', '   ', 'GGG'])
    );
  });

  it('should paint a full height slice', async () => {
    const processor = new JimpProcessor();
    const painted = await processor.paint(
      await createTestBuffer(['GGG', 'GGG', 'GGG']),
      0,
      0,
      2,
      3,
      '#fff'
    );

    await expectIdenticalBuffers(
      painted,
      await createTestBuffer(['  G', '  G', '  G'])
    );
  });

  const outOfBoundsCoordinates = [
    ['right', 0, 0, 1, 4],
    ['bottom', 0, 0, 4, 1],
    ['left', -1, 0, 1, 1],
    ['top', 0, -1, 1, 1],
  ] as const;

  for (const [edge, x, y, w, h] of outOfBoundsCoordinates) {
    it(`should throw when trying to crop past the ${edge} edge`, async () => {
      const processor = new JimpProcessor();

      await expect(
        processor.crop(
          await createTestBuffer(['GGG', 'GGG', 'GGG']),
          x,
          y,
          w,
          h
        )
      ).rejects.toThrow(OutOfBoundsError);
    });
  }

  for (const [edge, x, y, w, h] of outOfBoundsCoordinates) {
    it(`should throw when trying to paint past the ${edge} edge`, async () => {
      const processor = new JimpProcessor();

      await expect(
        processor.paint(
          await createTestBuffer(['GGG', 'GGG', 'GGG']),
          x,
          y,
          w,
          h,
          '#000'
        )
      ).rejects.toThrow(OutOfBoundsError);
    });
  }
});
