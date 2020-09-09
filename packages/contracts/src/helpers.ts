import fs from 'fs-extra';
import { PixelDiffer } from 'mugshot';
import { dirname, join } from 'path';

/**
 * Expect that the given screenshot matches the baseline on disk.
 *
 * This is sort of a basic re-implementation of Mugshot without all
 * of its features. It only depends on its [[PixelDiffer]] module.
 */
export async function expectIdenticalScreenshots(
  screenshot: Buffer,
  baselinePath: string
) {
  /* istanbul ignore next because this is here for convenience when
  writing new tests that don't have baselines */
  if (!(await fs.pathExists(baselinePath))) {
    await fs.mkdirp(dirname(baselinePath));
    await fs.writeFile(baselinePath, screenshot);

    throw new Error(`${baselinePath} didn't exist so I wrote a new one.`);
  }

  const baseline = await fs.readFile(baselinePath);

  const differ = new PixelDiffer({ threshold: 0 });
  const result = await differ.compare(baseline, screenshot);

  /* istanbul ignore next because this is here for convenience when
   updating baselines */
  if (!result.matches) {
    const tmpPath = await fs.mkdtemp(`/tmp/`);
    const diffPath = join(tmpPath, 'diff.png');
    const actualPath = join(tmpPath, 'actual.png');

    await fs.writeFile(diffPath, result.diff);
    await fs.writeFile(actualPath, screenshot);

    throw new Error(
      `Screenshot didn't match ${baselinePath}.

Diff was written at ${diffPath}, actual was written at ${actualPath}`
    );
  }
}
