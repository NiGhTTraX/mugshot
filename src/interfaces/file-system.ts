/* eslint-disable semi */
export default interface FileSystem {
  readFile: (name: string) => Promise<Buffer>;
  pathExists: (path: string) => Promise<boolean>;

  /**
   * (Over)write a file and create its parent folder structure if missing.
   */
  outputFile: (path: string, data: Buffer) => Promise<void>;
}
