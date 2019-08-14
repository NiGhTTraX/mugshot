import { outputFile, pathExists, readFile } from 'fs-extra';
import path from 'path';
import ScreenshotStorage from '../interfaces/screenshot-storage';

export default class FsStorage implements ScreenshotStorage {
  private readonly resultsPath: string;

  /**
   * @param resultsPath The entire folder structure will be created if missing.
   */
  constructor(resultsPath: string) {
    this.resultsPath = resultsPath;
  }

  writeBaseline = async (name: string, data: Buffer) => outputFile(this.getPath(name), data);

  baselineExists = async (name: string) => pathExists(this.getPath(name));

  getBaseline = async (name: string) => readFile(this.getPath(name));

  private getPath(filePath: string) {
    return path.join(this.resultsPath, `${filePath}.png`);
  }
}
