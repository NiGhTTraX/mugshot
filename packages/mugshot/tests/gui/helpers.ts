/* istanbul ignore next because this will get stringified and sent to the browser */
import fs from 'fs-extra';
import path from 'path';

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
