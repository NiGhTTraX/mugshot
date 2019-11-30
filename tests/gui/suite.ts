import fs from 'fs-extra';
import path from 'path';
import { expect } from 'tdd-buffet/expect/chai';
import { Browser, setViewportSize } from 'tdd-buffet/suite/gui';
import PixelDiffer from '../../packages/mugshot/src/lib/pixel-differ';

const { BROWSER = 'chrome' } = process.env;

/* istanbul ignore next because this will get stringified and sent to the browser */
function createFixture(html: string) {
  // This should use `document.write` instead but Firefox gives an "insecure operation" error.
  document.body.innerHTML = html;
}

export async function loadFixture(browser: Browser, name: string) {
  const fixtureContent = await fs.readFile(
    path.join(__dirname, `./fixtures/${name}.html`),
    { encoding: 'utf8' }
  );

  await browser.url('about:blank');

  await browser.execute(createFixture, fixtureContent);

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
  const browser = process.env.BROWSER;

  const resultsPath = await fs.mkdtemp(`/tmp/mugshot-${browser}`);

  await fs.copyFile(
    path.join(__dirname, `screenshots/${browser}/${baseline}.png`),
    path.join(resultsPath, `${baseline}.png`)
  );

  return resultsPath;
}
