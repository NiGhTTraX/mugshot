import { compareBuffers, describe, it } from '../../../../../../tests/node/suite';
import JimpProcessor from '../../../../src/lib/jimp-processor';
import {
  blueSquare50x50Buffer,
  greenSquare50x50Buffer,
  redSquare50x50Buffer,
  rgbySquare100x100Buffer,
  rgbySquare50x50Buffer,
  yellowSquare50x50Buffer
} from '../../../../../../tests/node/fixtures';

describe('JimpProcessor', () => {
  it('should crop the entire image', async () => {
    const processor = new JimpProcessor();
    const cropped = await processor.crop(rgbySquare100x100Buffer, 0, 0, 100, 100);

    // TODO: expect identical buffer instead?
    await compareBuffers(cropped, rgbySquare100x100Buffer);
  });

  it('should crop a square from the center', async () => {
    const processor = new JimpProcessor();
    const cropped = await processor.crop(rgbySquare100x100Buffer, 25, 25, 50, 50);

    await compareBuffers(cropped, rgbySquare50x50Buffer);
  });

  it('should crop a square from the top left corner', async () => {
    const processor = new JimpProcessor();
    const cropped = await processor.crop(rgbySquare100x100Buffer, 0, 0, 50, 50);

    await compareBuffers(cropped, redSquare50x50Buffer);
  });

  it('should crop a square from the top right corner', async () => {
    const processor = new JimpProcessor();
    const cropped = await processor.crop(rgbySquare100x100Buffer, 50, 0, 50, 50);

    await compareBuffers(cropped, greenSquare50x50Buffer);
  });

  it('should crop a square from the bottom left corner', async () => {
    const processor = new JimpProcessor();
    const cropped = await processor.crop(rgbySquare100x100Buffer, 0, 50, 50, 50);

    await compareBuffers(cropped, blueSquare50x50Buffer);
  });

  it('should crop a square from the bottom right corner', async () => {
    const processor = new JimpProcessor();
    const cropped = await processor.crop(rgbySquare100x100Buffer, 50, 50, 50, 50);

    await compareBuffers(cropped, yellowSquare50x50Buffer);
  });
});
