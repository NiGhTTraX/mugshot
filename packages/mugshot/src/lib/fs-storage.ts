import { outputFile, pathExists, readFile } from 'fs-extra';
import path from 'path';
import ScreenshotStorage from '../interfaces/screenshot-storage';

export default class FsStorage implements ScreenshotStorage {
  private readonly resultsPath: string;

  constructor(resultsPath: string) {
    this.resultsPath = resultsPath;
  }

  outputFile = async (
    filePath: string,
    screenshot: Buffer
  ) => outputFile(this.getPath(filePath), screenshot);

  pathExists = async (filePath: string) => pathExists(this.getPath(filePath));

  readFile = async (filePath: string) => readFile(this.getPath(filePath));

  private getPath(filePath: string) {
    return path.join(this.resultsPath, `${filePath}.png`);
  }
}
