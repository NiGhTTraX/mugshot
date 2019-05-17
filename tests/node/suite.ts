import { expect } from 'chai';
import Jimp from 'jimp';
import { runnerAfterEach, runnerBeforeEach, runnerDescribe, runnerIt } from '../mocha-runner';

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

export async function expectIdenticalBuffers(screenshot: Buffer, baseline: Buffer) {
  const screenshotJimp = await Jimp.read(screenshot);
  const baselineJimp = await Jimp.read(baseline);

  const sWidth = screenshotJimp.getWidth();
  const sHeight = screenshotJimp.getHeight();
  const bWidth = baselineJimp.getWidth();
  const bHeight = baselineJimp.getHeight();

  expect(sWidth, 'Images have different widths').to.equal(bWidth);
  expect(bHeight, 'Images have different heights').to.equal(bHeight);

  for (let x = 0; x < sWidth; x++) {
    for (let y = 0; y < sHeight; y++) {
      expect(
        Jimp.intToRGBA(screenshotJimp.getPixelColor(x, y)),
        `Pixel at ${x}, ${y} has a different color`
      ).to.deep.equal(
        Jimp.intToRGBA(baselineJimp.getPixelColor(x, y))
      );
    }
  }
}
