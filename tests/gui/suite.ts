import { Browser, setViewportSize } from 'tdd-buffet/suite/gui';
import { expect } from 'tdd-buffet/suite/expect';
import fs from 'fs-extra';
import path from 'path';
import PixelDiffer from '../../packages/mugshot/src/lib/pixel-differ';

const { BROWSER = 'chrome' } = process.env;

export async function loadFixture(browser: Browser, name: string) {
  await browser.url(`file:///var/www/html/${name}.html`);

  await setViewportSize(1024, 768);
}

/**
 * Use PixelDiffer to compare two screenshots. Assume that PixelDiffer passes all of its tests.
 */
export async function expectIdenticalScreenshots(
  screenshot: Buffer | string,
  baselineName: string,
  message?: string
) {
  const baseline = await fs.readFile(
    path.join(__dirname, `screenshots/${BROWSER}/${baselineName}.png`)
  );

  if (typeof screenshot === 'string') {
    // eslint-disable-next-line no-param-reassign
    screenshot = await fs.readFile(screenshot);
  }

  const differ = new PixelDiffer({ threshold: 0 });
  expect((await differ.compare(baseline, screenshot)).matches, message).to.be.true;
}

/**
 * Create a temp folder with a single baseline in it.
 *
 * @param baseline The name of the baseline, without the extension.
 *
 * @return The path to the temp folder.
 */
export async function createResultsDirWithBaseline(baseline: string) {
  const browser = process.env.BROWSER;

  const resultsPath = await fs.mkdtemp(`/tmp/mugshot-${browser}`);

  await fs.copyFile(
    path.join(__dirname, `screenshots/${browser}/${baseline}.png`),
    path.join(resultsPath, `${baseline}.png`)
  );

  return resultsPath;
}
