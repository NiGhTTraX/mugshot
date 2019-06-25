import {
  createTestBuffer,
  describe,
  expectIdenticalBuffers,
  it
} from '../../../../../../tests/node/suite';
import JimpProcessor from '../../../../src/lib/jimp-processor';

describe('JimpProcessor', () => {
  it('should crop the entire image', async () => {
    const processor = new JimpProcessor();
    const img = await createTestBuffer([
      'KKKK',
      'KKKK',
      'KKKK',
      'KKKK'
    ]);
    const cropped = await processor.crop(img, 0, 0, 4, 4);

    await expectIdenticalBuffers(cropped, img);
  });

  it('should crop a square from the center', async () => {
    const processor = new JimpProcessor();
    const cropped = await processor.crop(await createTestBuffer([
      '    ',
      ' GG ',
      ' GG ',
      '    '
    ]), 1, 1, 2, 2);

    await expectIdenticalBuffers(cropped, await createTestBuffer([
      'GG',
      'GG'
    ]));
  });

  it('should crop a square from the top left corner', async () => {
    const processor = new JimpProcessor();
    const cropped = await processor.crop(await createTestBuffer([
      'GG  ',
      'GG  ',
      '    ',
      '   '
    ]), 0, 0, 2, 2);

    await expectIdenticalBuffers(cropped, await createTestBuffer([
      'GG',
      'GG'
    ]));
  });

  it('should crop a square from the top right corner', async () => {
    const processor = new JimpProcessor();
    const cropped = await processor.crop(await createTestBuffer([
      '  GG',
      '  GG',
      '    ',
      '    '
    ]), 2, 0, 2, 2);

    await expectIdenticalBuffers(cropped, await createTestBuffer([
      'GG',
      'GG'
    ]));
  });

  it('should crop a square from the bottom left corner', async () => {
    const processor = new JimpProcessor();
    const cropped = await processor.crop(await createTestBuffer([
      '    ',
      '    ',
      'GG  ',
      'GG  '
    ]), 0, 2, 2, 2);

    await expectIdenticalBuffers(cropped, await createTestBuffer([
      'GG',
      'GG'
    ]));
  });

  it('should crop a square from the bottom right corner', async () => {
    const processor = new JimpProcessor();
    const cropped = await processor.crop(await createTestBuffer([
      '    ',
      '    ',
      '  GG',
      '  GG'
    ]), 2, 2, 2, 2);

    await expectIdenticalBuffers(cropped, await createTestBuffer([
      'GG',
      'GG'
    ]));
  });

  it('should paint the entire square', async () => {
    const processor = new JimpProcessor();
    const painted = await processor.paint(await createTestBuffer([
      'GG',
      'GG'
    ]), 0, 0, 2, 2, '#ff0000');

    await expectIdenticalBuffers(painted, await createTestBuffer([
      'RR',
      'RR'
    ]));
  });

  it('should paint a full width slice', async () => {
    const processor = new JimpProcessor();
    const painted = await processor.paint(await createTestBuffer([
      'GGG',
      'GGG',
      'GGG'
    ]), 0, 0, 3, 2, '#fff');

    await expectIdenticalBuffers(painted, await createTestBuffer([
      '   ',
      '   ',
      'GGG'
    ]));
  });

  it('should paint a full height slice', async () => {
    const processor = new JimpProcessor();
    const painted = await processor.paint(await createTestBuffer([
      'GGG',
      'GGG',
      'GGG'
    ]), 0, 0, 2, 3, '#fff');

    await expectIdenticalBuffers(painted, await createTestBuffer([
      '  G',
      '  G',
      '  G'
    ]));
  });
});
