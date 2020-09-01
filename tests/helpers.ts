import fs from 'fs-extra';
import { PixelDiffer } from 'mugshot';
import { dirname, join } from 'path';

/**
 * Use PixelDiffer to compare two screenshots.
 *
 * Assume that PixelDiffer passes all of its tests.
 */
export async function expectIdenticalScreenshots(
  screenshot: Buffer | string,
  baselinePath: string
) {
  if (!(await fs.pathExists(baselinePath)) && typeof screenshot !== 'string') {
    await fs.mkdirp(dirname(baselinePath));
    await fs.writeFile(baselinePath, screenshot);

    throw new Error(`${baselinePath} didn't exist so I wrote a new one.`);
  }

  const baseline = await fs.readFile(baselinePath);

  if (typeof screenshot === 'string') {
    // eslint-disable-next-line no-param-reassign
    screenshot = await fs.readFile(screenshot);
  }

  const differ = new PixelDiffer({ threshold: 0 });
  const result = await differ.compare(baseline, screenshot);

  if (!result.matches) {
    const tmpPath = await fs.mkdtemp(`/tmp/`);
    const diffPath = join(tmpPath, 'diff.png');

    await fs.writeFile(diffPath, result.diff);

    throw new Error(
      `Screenshot didn't match ${baselinePath}. Diff was written at ${diffPath}`
    );
  }
}
