import { expectIdenticalBuffers, describe, it } from '../../../../../../tests/node/suite';
import JimpProcessor from '../../../../src/lib/jimp-processor';
import {
  blackSquare50x50Buffer,
  blueSquare50x50Buffer,
  diffBlackSquare100x100BlackSquare100x50Buffer,
  diffBlackSquare100x100BlackSquare50x100Buffer,
  greenSquare50x50Buffer,
  redSquare100x100Buffer,
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
    await expectIdenticalBuffers(cropped, rgbySquare100x100Buffer);
  });

  it('should crop a square from the center', async () => {
    const processor = new JimpProcessor();
    const cropped = await processor.crop(rgbySquare100x100Buffer, 25, 25, 50, 50);

    await expectIdenticalBuffers(cropped, rgbySquare50x50Buffer);
  });

  it('should crop a square from the top left corner', async () => {
    const processor = new JimpProcessor();
    const cropped = await processor.crop(rgbySquare100x100Buffer, 0, 0, 50, 50);

    await expectIdenticalBuffers(cropped, redSquare50x50Buffer);
  });

  it('should crop a square from the top right corner', async () => {
    const processor = new JimpProcessor();
    const cropped = await processor.crop(rgbySquare100x100Buffer, 50, 0, 50, 50);

    await expectIdenticalBuffers(cropped, greenSquare50x50Buffer);
  });

  it('should crop a square from the bottom left corner', async () => {
    const processor = new JimpProcessor();
    const cropped = await processor.crop(rgbySquare100x100Buffer, 0, 50, 50, 50);

    await expectIdenticalBuffers(cropped, blueSquare50x50Buffer);
  });

  it('should crop a square from the bottom right corner', async () => {
    const processor = new JimpProcessor();
    const cropped = await processor.crop(rgbySquare100x100Buffer, 50, 50, 50, 50);

    await expectIdenticalBuffers(cropped, yellowSquare50x50Buffer);
  });

  it('should paint the entire square', async () => {
    const processor = new JimpProcessor();
    const painted = await processor.paint(blueSquare50x50Buffer, 0, 0, 50, 50, '#000');

    await expectIdenticalBuffers(painted, blackSquare50x50Buffer);
  });

  it('should paint a full width slice', async () => {
    const processor = new JimpProcessor();
    const painted = await processor.paint(redSquare100x100Buffer, 0, 0, 100, 50, '#fff');

    await expectIdenticalBuffers(painted, diffBlackSquare100x100BlackSquare100x50Buffer);
  });

  it('should paint a full height slice', async () => {
    const processor = new JimpProcessor();
    const painted = await processor.paint(redSquare100x100Buffer, 0, 0, 50, 100, '#fff');

    await expectIdenticalBuffers(painted, diffBlackSquare100x100BlackSquare50x100Buffer);
  });
});
