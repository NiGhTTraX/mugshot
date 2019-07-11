import { expect } from 'chai';
import CustomJimp from 'mugshot/src/vendor/custom-jimp';

export { expect };

export {
  runnerIt as it,
  runnerAfterEach as afterEach,
  runnerBeforeEach as beforeEach,
  runnerDescribe as describe
} from '../jest-runner';

/**
 * Do a slow pixel by pixel comparison between 2 buffers.
 */
export async function expectIdenticalBuffers(actual: Buffer, expected: Buffer) {
  const screenshotJimp = await CustomJimp.read(actual);
  const baselineJimp = await CustomJimp.read(expected);

  const sWidth = screenshotJimp.getWidth();
  const sHeight = screenshotJimp.getHeight();
  const bWidth = baselineJimp.getWidth();
  const bHeight = baselineJimp.getHeight();

  expect(sWidth, 'Images have different widths').to.equal(bWidth);
  expect(bHeight, 'Images have different heights').to.equal(bHeight);

  for (let x = 0; x < sWidth; x++) {
    for (let y = 0; y < sHeight; y++) {
      expect(
        CustomJimp.intToRGBA(screenshotJimp.getPixelColor(x, y)),
        `Pixel at ${x}, ${y} has a different color`
      ).to.deep.equal(
        CustomJimp.intToRGBA(baselineJimp.getPixelColor(x, y))
      );
    }
  }
}

function getHexFromChar(pixel: string) {
  switch (pixel) {
    case 'R': return CustomJimp.cssColorToHex('#ff0000');
    case 'G': return CustomJimp.cssColorToHex('#00ff00');
    case 'B': return CustomJimp.cssColorToHex('#0000ff');
    case 'K': return CustomJimp.cssColorToHex('#000000');
    default: return CustomJimp.cssColorToHex('#ffffff');
  }
}

/**
 * Create image buffer from ASCII art.
 *
 * @param rows Supports 'R' (red), 'B' (blue), 'G' (green), 'K' (black) and ' ' (white).
 */
export async function createTestBuffer(rows: [string, ...string[]]): Promise<Buffer> {
  const j = new CustomJimp(rows[0].length, rows.length);

  let y = 0;
  // eslint-disable-next-line no-restricted-syntax
  for (const row of rows) {
    let x = 0;

    // eslint-disable-next-line no-restricted-syntax
    for (const pixel of row) {
      // eslint-disable-next-line no-await-in-loop
      await j.setPixelColor(getHexFromChar(pixel), x, y);

      x++;
    }

    y++;
  }

  return j.getBufferAsync(CustomJimp.MIME_PNG);
}

/**
 * Lightens the image.
 *
 * @param b
 * @param amount Lighten the image this much, from 0 to 100.
 *   100 will return white, 0 will return the original image.
 */
export async function lightenBuffer(b: Buffer, amount: number): Promise<Buffer> {
  const j = await CustomJimp.read(b);

  j.color([{ apply: 'tint', params: [amount] }]);

  return j.getBufferAsync(CustomJimp.MIME_PNG);
}
