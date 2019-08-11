import ScreenshotStorage from '../interfaces/screenshot-storage';
import { outputFile, pathExists, readFile } from 'fs-extra';

export default class FsStorage implements ScreenshotStorage {
  outputFile = outputFile;

  pathExists = pathExists;

  readFile = readFile;
}
