import { expect } from 'chai';
import { runnerAfterEach, runnerBeforeEach, runnerDescribe, runnerIt } from '../mocha-runner';
import CustomJimp from 'mugshot/src/lib/custom-jimp';

export { expect };

export function describe(name: string, definition: () => void) {
  runnerDescribe(name, () => {
    definition();
  });
}

export function it(name: string, definition?: () => Promise<any>|void) {
  runnerIt(name, definition);
}

export function beforeEach(definition: () => Promise<any>|void) {
  runnerBeforeEach(definition);
}

export function afterEach(definition: () => Promise<any>|void) {
  runnerAfterEach(definition);
}

/**
 * Do a slow pixel by pixel comparison between 2 buffers.
 */
export async function expectIdenticalBuffers(screenshot: Buffer, baseline: Buffer) {
  const screenshotJimp = await CustomJimp.read(screenshot);
  const baselineJimp = await CustomJimp.read(baseline);

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
