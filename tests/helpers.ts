import fs from 'fs-extra';
import { PixelDiffer } from 'mugshot';
import { expect } from 'tdd-buffet/expect/chai';

/**
 * Use PixelDiffer to compare two screenshots.
 *
 * Assume that PixelDiffer passes all of its tests.
 */
export async function expectIdenticalScreenshots(
  screenshot: Buffer | string,
  baselinePath: string,
  message?: string
) {
  const baseline = await fs.readFile(baselinePath);

  if (typeof screenshot === 'string') {
    // eslint-disable-next-line no-param-reassign
    screenshot = await fs.readFile(screenshot);
  }

  const differ = new PixelDiffer({ threshold: 0 });
  expect((await differ.compare(baseline, screenshot)).matches, message).to.be
    .true;
}
