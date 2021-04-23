import { outputFile, pathExists, readFile, remove } from 'fs-extra';
import path from 'path';
import { ScreenshotStorage } from '../interfaces/screenshot-storage';

/**
 * Write and read baselines to and from the local file system.
 *
 * Screenshots will be saved with a `.png` extension.
 */
export class FsStorage implements ScreenshotStorage {
  /**
   * @param resultsPath The entire folder structure will be created if missing.
   */
  constructor(private readonly resultsPath: string) {}

  write = async (name: string, data: Buffer) =>
    outputFile(this.getPath(name), data);

  exists = async (name: string) => pathExists(this.getPath(name));

  read = async (name: string) => readFile(this.getPath(name));

  delete = async (name: string) => remove(this.getPath(name));

  private getPath(filePath: string) {
    return path.join(this.resultsPath, `${filePath}.png`);
  }
}
