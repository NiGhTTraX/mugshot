import fs from 'fs-extra';
import path from 'path';
import { expect } from 'chai';
import { pixelDiffer } from 'mugshot';

/**
 * Use Mugshot's PixelDiffer to compare two screenshots.
 */
// TODO: dedupe with gui/suite
export async function expectIdenticalScreenshots(
  screenshot: Buffer,
  baselineName: string,
  message?: string
) {
  const { BROWSER } = process.env;

  const baseline = await fs.readFile(
    path.join(__dirname, `./screenshots/${BROWSER}/${baselineName}.png`)
  );

  // eslint-disable-next-line no-unused-expressions
  expect((await pixelDiffer.compare(baseline, screenshot)).matches, message).to.be.true;
}
