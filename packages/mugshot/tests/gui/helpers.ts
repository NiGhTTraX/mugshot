/* istanbul ignore next because this will get stringified and sent to the browser */
import fs from 'fs-extra';
import path from 'path';
import { expect } from 'tdd-buffet/expect/chai';
import PixelDiffer from '../../src/lib/pixel-differ';

/**
 * Use PixelDiffer to compare two screenshots. Assume that PixelDiffer passes all of its tests.
 */
export async function expectIdenticalScreenshots(
  screenshot: Buffer | string,
  baselineName: string,
  message?: string
) {
  const baseline = await fs.readFile(
    path.join(__dirname, `screenshots/${baselineName}.png`)
  );

  if (typeof screenshot === 'string') {
    // eslint-disable-next-line no-param-reassign
    screenshot = await fs.readFile(screenshot);
  }

  const differ = new PixelDiffer({ threshold: 0 });
  expect((await differ.compare(baseline, screenshot)).matches, message).to.be
    .true;
}

/**
 * Create a temp folder with a single baseline in it.
 *
 * @param baseline The name of the baseline, without the extension.
 *
 * @return The path to the temp folder.
 */
export async function createResultsDirWithBaseline(baseline: string) {
  const resultsPath = await fs.mkdtemp(`/tmp/mugshot-chrome`);

  await fs.copyFile(
    path.join(__dirname, `screenshots/${baseline}.png`),
    path.join(resultsPath, `${baseline}.png`)
  );

  return resultsPath;
}
